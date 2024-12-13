// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTDonar is Ownable {
    struct Donation {
        address donor; // Dirección del propietario del NFT
        uint256 tokenId; // ID del NFT donado
        bool claimed; // Indica si el NFT ha sido reclamado
        string tokenURI; // URI del token o imagen asociada
    }

    struct Beneficiary {
        address beneficiaryAddress; // Dirección del beneficiario
        bool hasClaimed; // Indica si el beneficiario ha reclamado su donación
    }

    IERC721 public nftContract; // Contrato NFT asociado a las donaciones
    mapping(uint256 => Donation) public donations; // Donaciones por tokenId
    mapping(address => Beneficiary) public beneficiaries; // Lista de beneficiarios
    uint256[] public activeDonations; // Lista de todas las donaciones activas

    event DonationCreated(address indexed donor, uint256 indexed tokenId, string tokenURI);
    event DonationClaimed(address indexed beneficiary, uint256 indexed tokenId);
    event BeneficiaryAdded(address indexed beneficiaryAddress);
    event BeneficiaryStatusUpdated(address indexed beneficiaryAddress, bool hasClaimed);

    /**
     * @dev Constructor para inicializar el contrato NFTDonar.
     * @param _nftContractAddress Dirección del contrato NFT (ERC721).
     */
    constructor(address _nftContractAddress) {
        nftContract = IERC721(_nftContractAddress);
    }

    /**
     * @dev Crear una donación de NFT.
     * @param _tokenId ID del NFT que se donará.
     * @param _tokenURI URI del token o imagen asociada.
     */
    function createDonation(uint256 _tokenId, string memory _tokenURI) external {
        require(donations[_tokenId].donor == address(0), "El NFT ya esta en donacion");
        require(nftContract.ownerOf(_tokenId) == msg.sender, "No eres el propietario del NFT");

        // Transferir el NFT al contrato
        nftContract.transferFrom(msg.sender, address(this), _tokenId);

        donations[_tokenId] = Donation({
            donor: msg.sender,
            tokenId: _tokenId,
            claimed: false,
            tokenURI: _tokenURI
        });

        activeDonations.push(_tokenId);

        emit DonationCreated(msg.sender, _tokenId, _tokenURI);
    }

    /**
     * @dev Reclamar una donación de NFT.
     * @param _tokenId ID del NFT a reclamar.
     */
    function claimDonation(uint256 _tokenId) external {
        require(beneficiaries[msg.sender].beneficiaryAddress != address(0), "No eres un beneficiario autorizado");
        require(!beneficiaries[msg.sender].hasClaimed, "Ya has reclamado una donacion");
        require(!donations[_tokenId].claimed, "La donacion ya ha sido reclamada");

        donations[_tokenId].claimed = true;
        beneficiaries[msg.sender].hasClaimed = true;

        // Transferir el NFT al beneficiario
        nftContract.transferFrom(address(this), msg.sender, _tokenId);

        _removeFromActiveDonations(_tokenId);

        emit DonationClaimed(msg.sender, _tokenId);
    }

    /**
     * @dev Agregar un beneficiario.
     * @param _beneficiaryAddress Dirección del beneficiario.
     */
    function addBeneficiary(address _beneficiaryAddress) external onlyOwner {
        require(beneficiaries[_beneficiaryAddress].beneficiaryAddress == address(0), "El beneficiario ya esta registrado");

        beneficiaries[_beneficiaryAddress] = Beneficiary({
            beneficiaryAddress: _beneficiaryAddress,
            hasClaimed: false
        });

        emit BeneficiaryAdded(_beneficiaryAddress);
    }

    /**
     * @dev Cambiar el estado de "reclamado" de un beneficiario.
     * @param _beneficiaryAddress Dirección del beneficiario.
     * @param _hasClaimed Nuevo estado de "reclamado".
     */
    function updateBeneficiaryStatus(address _beneficiaryAddress, bool _hasClaimed) external onlyOwner {
        require(beneficiaries[_beneficiaryAddress].beneficiaryAddress != address(0), "El beneficiario no esta registrado");

        beneficiaries[_beneficiaryAddress].hasClaimed = _hasClaimed;

        emit BeneficiaryStatusUpdated(_beneficiaryAddress, _hasClaimed);
    }

    /**
     * @dev Obtener detalles completos de las donaciones activas.
     * @return Array de structs de donaciones activas.
     */
    function getActiveDonationDetails() external view returns (Donation[] memory) {
        Donation[] memory details = new Donation[](activeDonations.length);
        for (uint256 i = 0; i < activeDonations.length; i++) {
            details[i] = donations[activeDonations[i]];
        }
        return details;
    }

    /**
     * @dev Obtener detalles de una donación específica.
     * @param _tokenId ID de la donación.
     * @return Detalles de la donación.
     */
    function getDonationDetails(uint256 _tokenId) external view returns (Donation memory) {
        return donations[_tokenId];
    }

    /**
     * @dev Eliminar un token de la lista de donaciones activas.
     * @param _tokenId ID de la donación a eliminar.
     */
    function _removeFromActiveDonations(uint256 _tokenId) internal {
        for (uint256 i = 0; i < activeDonations.length; i++) {
            if (activeDonations[i] == _tokenId) {
                activeDonations[i] = activeDonations[activeDonations.length - 1];
                activeDonations.pop();
                break;
            }
        }
    }
}
