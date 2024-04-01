package com.example.Loginregister.example;

//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class Controler {
//
//    private static final Logger logger = LoggerFactory.getLogger(Controler.class);
//    @Autowired
//    private modelService modelService;
//
//    public Controler (modelService modelService){
//        this.modelService= modelService;
//    }
//    @PostMapping("/creating")
//    public String create(@RequestBody String payload){
//        logger.info("sending body to service"+payload);
//        return modelService.create(payload);
//    }
//    @PostMapping("/create")
//    public Model create(@RequestBody Model body){
//        logger.info("Sending body"+body);
//        return modelService.save(body);
//    }
//}

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
public class Controler {
    private static final Logger logger = LoggerFactory.getLogger(Controler.class);

    private modelService modelService;

    public Controler (modelService modelService){
        this.modelService=modelService;
    }
    @PostMapping("/create")
    public Model create (@RequestBody Model data){
        logger.info("sending request body"+data);
        return modelService.save(data);
    }
    @GetMapping("/getdetails")
    public String getData(@RequestParam String id){
        logger.info(("getting data by id"+ id));
        return modelService.gettingData(id).toString();
    }
    @DeleteMapping("/delete")
    public String deleteByID(@RequestParam String id){
        logger.info(("Delete data by id"+ id));
        return modelService.deletingData(id);
    }

//    @PutMapping("/update")
//    public ResponseEntity<String> updateModel (@RequestParam String id, @RequestBody Model updateData){
//        if (!id.equals(updateData.getId())) {
//            return ResponseEntity.badRequest().body("ID provided in URL does not match ID of the model to update") ;
//        }
//        try {
//
//            Model updateModel = modelService.updateModelData(updateData);
//            return ResponseEntity.ok("Model updatedSuccessfully");
//        } catch (RuntimeException e){
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
    @PutMapping("/update")
    public String updateModel (@RequestParam String id, @RequestBody Model updateData){
        if(!id.equals(updateData.getId())){
            logger.info("Model not found with id"+ id);
            return "Model not found with id";
        }
        modelService.updateModelData(updateData);
        logger.info("Updated successfully");
        return "Updated successfully";
    }


}