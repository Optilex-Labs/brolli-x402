//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";

contract Brolli is ERC721Enumerable, Ownable, ReentrancyGuard, EIP712 {
	using Counters for Counters.Counter;
	using SafeERC20 for IERC20;

	Counters.Counter private _tokenIds;

	struct Meta {
		string name;
		string imageUri;
		string provenanceCid;
	}

	// Events
	event DefaultImageUriUpdated(string newImageUri);
	event DefaultProvenanceCidUpdated(string newProvenanceCid);
	event LicenseSignerUpdated(address indexed newLicenseSigner);
	event LicenseUpdated(address indexed beneficiary, uint256 validUntil, uint256 indexed tokenId);
	event MintPriceUpdated(uint256 newPrice);
	event ResourceWalletUpdated(address indexed newWallet);

	mapping(uint256 => Meta) public metadataByTokenId;
	mapping(address => uint256) public licenseExpiry; // unix timestamp (seconds)
	mapping(bytes32 => bool) public usedVouchers; // replay protection (beneficiary+nonce)

	uint256 public constant MAX_SUPPLY = 50; // Maximum number of licenses that can be issued
	uint256 public constant LICENSE_TERM = 365 days;

	address public licenseSigner;
	
	// USDC payment configuration
	IERC20 public usdcToken;           // USDC token contract
	address public resourceWallet;      // Where USDC payments are sent
	uint256 public mintPrice;          // Price in USDC (6 decimals, e.g., 1000000 = $1)

	bytes32 private constant VOUCHER_TYPEHASH =
		keccak256("Voucher(address beneficiary,uint256 nonce,uint256 validUntil)");

	struct Voucher {
		address beneficiary;
		uint256 nonce;
		uint256 validUntil;
	}

	// Default URIs for new mints
	string public defaultImageUri = "https://tan-everyday-mite-419.mypinata.cloud/ipfs/bafkreialme2ca3b36nzq5rqqdqaw3k2le4uvgrdxtdj33t2j4sn44amisi";
	string public defaultProvenanceCid = "https://tan-everyday-mite-419.mypinata.cloud/ipfs/bafkreidc7qbkdsfirbetsu5owm56oeqkhwhqlxpfgjio4qy3xexigod2nq";

	constructor(
		address _usdcToken,
		address _resourceWallet,
		uint256 _mintPrice
	) ERC721("Brolli", "BROLLI") EIP712("Brolli", "1") {
		usdcToken = IERC20(_usdcToken);
		resourceWallet = _resourceWallet;
		mintPrice = _mintPrice;
	}

	function setLicenseSigner(address newLicenseSigner) external {
		licenseSigner = newLicenseSigner;
		emit LicenseSignerUpdated(newLicenseSigner);
	}

	function hasLicense(address who) public view returns (bool) {
		return licenseExpiry[who] > block.timestamp;
	}

	function mint(
		string memory name,
		string memory imageUri,
		string memory provenanceCid
	) external nonReentrant returns (uint256) {
		require(balanceOf(msg.sender) == 0, "Address already has Brolli");
		require(_tokenIds.current() < MAX_SUPPLY, "Maximum supply reached");

		// CRITICAL: Pull USDC payment from user BEFORE minting
		// User must have approved this contract to spend mintPrice USDC
		if (mintPrice > 0) {
			usdcToken.safeTransferFrom(msg.sender, resourceWallet, mintPrice);
		}

		_tokenIds.increment();
		uint256 tokenId = _tokenIds.current();
		_safeMint(msg.sender, tokenId);

		// Use default URIs if empty strings provided
		string memory finalImageUri = bytes(imageUri).length == 0 ? defaultImageUri : imageUri;
		string memory finalProvenanceCid = bytes(provenanceCid).length == 0 ? defaultProvenanceCid : provenanceCid;

		metadataByTokenId[tokenId] = Meta({
			name: name,
			imageUri: finalImageUri,
			provenanceCid: finalProvenanceCid
		});

		// Legacy free mint behavior: set a 1-year license from now
		licenseExpiry[msg.sender] = block.timestamp + LICENSE_TERM;
		emit LicenseUpdated(msg.sender, licenseExpiry[msg.sender], tokenId);

		return tokenId;
	}

	function mintOrRenewWithVoucher(
		Voucher calldata v,
		bytes calldata sig,
		string calldata name,
		string calldata imageUri,
		string calldata provenanceCid
	) external nonReentrant returns (uint256) {
		require(v.beneficiary == msg.sender, "Voucher beneficiary mismatch");
		require(block.timestamp <= v.validUntil, "Voucher expired");
		require(licenseSigner != address(0), "License signer not set");

		bytes32 voucherKey = keccak256(abi.encodePacked(v.beneficiary, v.nonce));
		require(!usedVouchers[voucherKey], "Voucher already used");

		bytes32 digest = _hashTypedDataV4(
			keccak256(abi.encode(VOUCHER_TYPEHASH, v.beneficiary, v.nonce, v.validUntil))
		);
		address recovered = ECDSA.recover(digest, sig);
		require(recovered == licenseSigner, "Invalid voucher signature");

		usedVouchers[voucherKey] = true;

		uint256 tokenId;
		if (balanceOf(msg.sender) == 0) {
			require(_tokenIds.current() < MAX_SUPPLY, "Maximum supply reached");
			_tokenIds.increment();
			tokenId = _tokenIds.current();
			_safeMint(msg.sender, tokenId);

			string memory finalImageUri = imageUri;
			if (bytes(finalImageUri).length == 0) finalImageUri = defaultImageUri;

			string memory finalProvenanceCid = provenanceCid;
			if (bytes(finalProvenanceCid).length == 0) finalProvenanceCid = defaultProvenanceCid;

			metadataByTokenId[tokenId] = Meta({
				name: name,
				imageUri: finalImageUri,
				provenanceCid: finalProvenanceCid
			});
		} else {
			tokenId = tokenOfOwnerByIndex(msg.sender, 0);
		}

		uint256 start = licenseExpiry[msg.sender] > block.timestamp ? licenseExpiry[msg.sender] : block.timestamp;
		licenseExpiry[msg.sender] = start + LICENSE_TERM;
		emit LicenseUpdated(msg.sender, licenseExpiry[msg.sender], tokenId);

		return tokenId;
	}

	// Get current supply and remaining licenses
	function currentSupply() public view returns (uint256) {
		return _tokenIds.current();
	}

	function remainingSupply() public view returns (uint256) {
		uint256 current = _tokenIds.current();
		return current >= MAX_SUPPLY ? 0 : MAX_SUPPLY - current;
	}

	// Owner-only functions to update default URIs
	function updateDefaultImageUri(string memory newImageUri) public onlyOwner {
		defaultImageUri = newImageUri;
		emit DefaultImageUriUpdated(newImageUri);
	}

	function updateDefaultProvenanceCid(string memory newProvenanceCid) public onlyOwner {
		defaultProvenanceCid = newProvenanceCid;
		emit DefaultProvenanceCidUpdated(newProvenanceCid);
	}

	function tokenURI(uint256 tokenId) public view override returns (string memory) {
		require(_exists(tokenId), "Token does not exist");
		Meta storage m = metadataByTokenId[tokenId];
		uint256 expiry = licenseExpiry[ownerOf(tokenId)];

		bytes memory json = abi.encodePacked(
			"{",
			'"name":"Brolli ', m.name, '",',
			'"description":"for BUIDLers",',
			'"image":"', m.imageUri, '",',
			'"attributes":[',
			'{"trait_type":"Provenance CID","value":"', m.provenanceCid, '"},',
			'{"trait_type":"Valid Until","display_type":"date","value":', Strings.toString(expiry), "}",
			'],',
			'"resources":{',
			'"provenance":"', m.provenanceCid, '"}',
			"}"
		);

		return string(
			abi.encodePacked(
				"data:application/json;base64,",
				Base64.encode(json)
			)
		);
	}

	// Make the token non-transferable (soulbound)
	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId,
		uint256 batchSize
	) internal override {
		require(from == address(0) || to == address(0), "Token is non-transferable");
		super._beforeTokenTransfer(from, to, tokenId, batchSize);
	}

	// Override approve functions to prevent approvals
	function approve(address, uint256) public pure override(ERC721, IERC721) {
		revert("Token is non-transferable");
	}

	function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
		revert("Token is non-transferable");
	}

	// Explicit supportsInterface override to silence compiler warnings
	function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable) returns (bool) {
		return super.supportsInterface(interfaceId);
	}

	// Owner-only functions to update USDC payment configuration
	function setMintPrice(uint256 _newPrice) external onlyOwner {
		mintPrice = _newPrice;
		emit MintPriceUpdated(_newPrice);
	}

	function setResourceWallet(address _newWallet) external onlyOwner {
		require(_newWallet != address(0), "Invalid wallet address");
		resourceWallet = _newWallet;
		emit ResourceWalletUpdated(_newWallet);
	}

	function setUsdcToken(address _newToken) external onlyOwner {
		require(_newToken != address(0), "Invalid token address");
		usdcToken = IERC20(_newToken);
	}
} 