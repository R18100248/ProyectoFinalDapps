// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./NFTCrear.sol";

contract NFTComprarJuguete {
    address public owner;
    uint256 public pricePerNFT = 0.0001 ether; // Precio fijo por NFT
    NFTCrear public nftCrear; // Referencia al contrato NFTFactory

    using Strings for uint256;
    event Attempt(address indexed user, bool success, string message);
    event NFTCreated(address indexed user, uint256 tokenId);
    event NFTPurchased(address indexed buyer, uint256 tokenId, string message);

    constructor(address _nftAddress) {
        owner = msg.sender;
        nftCrear = NFTCrear(_nftAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede ejecutar esta funcion");
        _;
    }

    /**
     * @dev Permite a los usuarios comprar un NFT directamente.
     * @param _imageUrl URL de la imagen que será asociada al NFT.
     */
    function buyNFT(string memory _imageUrl) external payable {
        require(msg.value >= pricePerNFT, "Monto insuficiente para comprar el NFT");

        // Acuñar el NFT directamente usando NFTFactory
        uint256 tokenId = nftCrear.mintNFT(msg.sender, _imageUrl);
        
        emit NFTPurchased(msg.sender, tokenId, "Has comprado un NFT con exito");
    }

    /**
     * @dev Cambia el precio para comprar un NFT directamente.
     * @param _newPrice Nuevo precio por NFT en wei.
     */
    function setPricePerNFT(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, "El precio debe ser mayor a 0");
        pricePerNFT = _newPrice;
    }

    /**
     * @dev Retira los fondos acumulados en el contrato.
     * @param _to Dirección a la que se enviarán los fondos.
     */
    function withdrawFunds(address payable _to) external onlyOwner {
        require(address(this).balance > 0, "No hay fondos para retirar");
        _to.transfer(address(this).balance);
    }

    /**
     * @dev Obtiene el balance actual del contrato.
     * @return El balance actual del contrato en wei.
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
