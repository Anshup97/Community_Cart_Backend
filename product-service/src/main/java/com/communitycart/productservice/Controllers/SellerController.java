package com.communitycart.productservice.Controllers;

import com.communitycart.productservice.dtos.CategoryDTO;
import com.communitycart.productservice.dtos.Location;
import com.communitycart.productservice.dtos.ProductDTO;
import com.communitycart.productservice.dtos.SellerDTO;
import com.communitycart.productservice.entity.Seller;
import com.communitycart.productservice.entity.User;
import com.communitycart.productservice.service.CategoryService;
import com.communitycart.productservice.service.FileStorageService;
import com.communitycart.productservice.service.SellerService;
import com.communitycart.productservice.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Seller API to manage sellers and their functionalities.
 */
@RestController
//@CrossOrigin(origins = "*")
@RequestMapping("/seller")
public class SellerController {

    @Autowired
    private SellerService sellerService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserService userService;


    /*
    Add new seller and return the created seller object.
    If there is an existing seller with same email, then return null.
     */
    @PostMapping(value = "/addSeller")
    public ResponseEntity<SellerDTO> addSeller(@RequestBody SellerDTO seller)
            throws IOException {
        User user = userService.getUser(seller.getEmail());
        if(user == null){
            System.out.println(seller.toString());
            SellerDTO seller1 = userService.addSeller(seller);
            return new ResponseEntity<>(seller1, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    /*
    Upload seller and customer profile photo.
    Saved in local.
     */
    @PostMapping(value = "/uploadPhoto/profile", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> uploadPhoto(@RequestParam("email") String email,
                                         @RequestPart("profilePhoto")MultipartFile profilePhoto)
            throws Exception {
        User user = userService.getUser(email);
        if(user != null){
            if(user.getRole().equals("SELLER")){
                SellerDTO seller = userService.uploadPhoto(email, profilePhoto);
                return new ResponseEntity<>(seller, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    /*
    Delete seller profile.
     */
    @PostMapping("/deleteSeller")
    public ResponseEntity<?> deleteSeller(@RequestBody SellerDTO seller){
        userService.deleteSeller(seller);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    /*
    Update seller details.
     */
    @PostMapping("/updateSeller")
    public ResponseEntity<?> updateSeller(@RequestBody Seller seller){

            Seller sellerId = userService.updateSeller(seller);
            return new ResponseEntity<>(sellerId, HttpStatus.OK);

    }

    /*
    Get seller by sellerId.
     */
    @GetMapping("/getSeller")
    public ResponseEntity<List<SellerDTO>> getSeller(@RequestParam(name = "sellerId", required = false) Long sellerId){
        if(sellerId == null){
            return new ResponseEntity<>(sellerService.getAllSellers(), HttpStatus.OK);
        }
        SellerDTO sellerDTO = userService.getSeller(sellerId);
        if(sellerDTO == null){
            return new ResponseEntity<>(null, HttpStatus.OK);
        }
        return new ResponseEntity<>(List.of(sellerDTO), HttpStatus.OK);
    }

    /*
    Get list of all sellers.
    Used if the customer is not logged in.
     */
    @GetMapping("/getAllSellers")
    public ResponseEntity<List<SellerDTO>> getAllSellers(){
        return ResponseEntity.ok(sellerService.getAllSellers());
    }

    /*
    Get list of all product categories sold by the seller.
    If sellerId is null, return list of all categories.
    Used if the customer is not logged in.
     */
    @GetMapping("/getSellerCategories")
    public ResponseEntity<?> getSellerCategories(@RequestParam(value = "sellerId", required = false) Long sellerId){
        if(sellerId == null){
            return new ResponseEntity<>(categoryService.getCategories().stream()
                    .map(c -> new ModelMapper().map(c, CategoryDTO.class))
                    .collect(Collectors.toList()), HttpStatus.OK);
        }
        List<CategoryDTO> categoryDTOS = sellerService.getCategoriesBySeller(sellerId);
        if(categoryDTOS == null || categoryDTOS.isEmpty()){
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }
        return ResponseEntity.ok(sellerService.getCategoriesBySeller(sellerId));
    }

    /*
    Get category icon to display in the UI.
     */
    @GetMapping("/getCategoryPhoto/{categoryId}")
    public ResponseEntity<?> getCategoryPhoto(@PathVariable(name = "categoryId") Long categoryId){
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf("image/png"))
                .body(sellerService.getCategoryPhoto(categoryId));
    }

    /**
     * Get list of nearby sellers as per the customer's location.
     * Used when the customer is logged in.
     * @param sourceLat
     * @param sourceLng
     * @param elevation
     * @param categoryId
     * @return
     */
    @GetMapping("/getNearbySellers")
    public ResponseEntity<?> getNearbySellers(@RequestParam Double sourceLat, @RequestParam Double sourceLng,
                                              @RequestParam Double elevation,
                                              @RequestParam(required = false) Long categoryId){
        List<SellerDTO> sellerDTOS = sellerService.getNearbySellers(sourceLat, sourceLng, elevation);
        if(sellerDTOS.isEmpty()){
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }
        if(categoryId == null){
            return new ResponseEntity<>(sellerDTOS, HttpStatus.OK);
        }
        Location loc = new Location(sourceLat, sourceLng, elevation);
        sellerDTOS = sellerService.getNearbySellersByCategory(loc, categoryId);
        if(sellerDTOS.isEmpty()){
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }
        return ResponseEntity.ok(sellerDTOS);
    }

    /**
     * Get all categories of products sold by nearby sellers.
     * @param location
     * @return
     */
    @GetMapping("/getNearBySellerCategories")
    public ResponseEntity<?> getNearbyCategories(@RequestBody Location location){
        return ResponseEntity.ok(sellerService.getNearbySellersCategory(location.getLatitude(), location.getLongitude(),
                location.getElevation()));
    }

    @GetMapping("/getSellerByEmail")
    public ResponseEntity<?> getSellerByEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.findByEmail(email));
    }
}
