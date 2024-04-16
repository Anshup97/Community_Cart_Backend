package com.communitycart.productservice.service;

import com.communitycart.productservice.client.UserClient;
import com.communitycart.productservice.dtos.AddressDTO;
import com.communitycart.productservice.dtos.SellerDTO;
import com.communitycart.productservice.entity.*;
import com.communitycart.productservice.repository.SellerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@Transactional
public class UserService {
    @Autowired
    private UserClient userClient;
    @Autowired
    private SellerRepository sellerRepository;
    @Autowired
    private FileStorageService fIleStorageService;

    @Autowired
    private ImageStorageService imageStorageService;
    public User getUser(String emailId){
        return userClient.findByEmailId(emailId);
    }

    public void createUser(User user){
        userClient.save(user);
    }

    public void deleteUser(String email){
        userClient.delete(email);
    }


    Address createAddress(AddressDTO addressDTO){
        Address address = new Address();
        address.setAddress1(addressDTO.getAddress1());
        address.setAddress2(addressDTO.getAddress2());
        address.setCity(addressDTO.getCity());
        address.setDistrict(addressDTO.getDistrict());
        address.setState(addressDTO.getState());
        address.setPinCode(addressDTO.getPinCode());
        address.setLatitude(addressDTO.getLatitude());
        address.setLongitude(addressDTO.getLongitude());
        return address;
    }


    public SellerDTO addSeller(SellerDTO seller) throws IOException {
        Seller sellerEntity = new Seller();
        sellerEntity.setName(seller.getName());
        sellerEntity.setEmail(seller.getEmail());
        sellerEntity.setContactPhoneNo(seller.getContactPhoneNo());
        sellerEntity.setAadharNo(seller.getAadharNo());
        sellerEntity.setShopName(seller.getShopName());
        ModelMapper modelMapper = new ModelMapper();
        sellerEntity.setAddress(modelMapper.map(seller.getAddress(), Address.class));
        sellerEntity.setGstin(seller.getGstin());
        createUser(new User(seller.getEmail(), seller.getPassword(), "SELLER"));
        return new ModelMapper().map(sellerRepository.save(sellerEntity), SellerDTO.class);
    }

    public void deleteSeller(SellerDTO seller){
        deleteUser(seller.getEmail());
        Seller seller1 = sellerRepository.findByEmail(seller.getEmail());
        sellerRepository.delete(seller1);
    }

    public Seller updateSeller(Seller seller){
        Seller seller1 = sellerRepository.findByEmail(seller.getEmail());
        seller1.setName(seller.getName());
        seller1.setContactPhoneNo(seller.getContactPhoneNo());
        seller1.setAadharNo(seller.getAadharNo());
        seller1.setShopName(seller.getShopName());
        seller1.setAddress(seller.getAddress());
        seller1.setGstin(seller.getGstin());
        seller1.setProducts(seller.getProducts());
        return sellerRepository.save(seller1);
    }


    public SellerDTO getSeller(Long id){

         return new ModelMapper().map(sellerRepository.findById(id), SellerDTO.class);
    }


    public SellerDTO uploadPhoto(String email, MultipartFile profilePhoto) throws Exception {
        Seller seller = sellerRepository.findByEmail(email);
        if(seller != null){
            String url = fIleStorageService.saveSellerPhoto(profilePhoto, seller.getSellerId());
            url = "http://172.17.84.49:8090/images/shop/" + url;
            seller.setShopPhotoUrl(url);
            return new ModelMapper().map(sellerRepository.save(seller), SellerDTO.class);
        }
        return null;

    }

    public Long findByEmail(String email) {
        return sellerRepository.findByEmail(email).getSellerId();
    }
}
