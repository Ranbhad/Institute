package com.example.Loginregister.example;

//import com.google.gson.Gson;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//
//import static org.springframework.http.ResponseEntity.status;
//
//@Service
//public class modelService {
//    private static final Logger logger = LoggerFactory.getLogger(modelService.class);
//    @Autowired
//    private Repo repo;
//    public Gson gson = new Gson();
//
//    public Model save(Model body) {
//        try {
//            logger.info("saving body" + body);
//            return repo.save(body);
//        }catch (Exception ex){
//            logger.debug("getting error"+ex);
//            return (Model) status(HttpStatus.BAD_REQUEST);
//        }
//    }
//
//    public String create(String body) {
//        try {
//            logger.info("coming boady from controller" + body);
//            Model model = gson.fromJson(body, Model.class);
//            logger.info("json object model class" + model);
//            Model model1 = repo.save(model);
//            logger.info("saved data" + model1);
//            return gson.toJson(model1);
//        } catch (Exception e){
//            logger.debug("error getting", e);
//            return status(HttpStatus.BAD_REQUEST).toString( );
//        }
//
//    }
//
//}

import org.bouncycastle.math.raw.Mod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import static org.springframework.web.servlet.function.ServerResponse.status;

@Service
public class modelService {

    private static final Logger logger = LoggerFactory.getLogger(modelService.class);

    @Autowired
    private Repo repo;

    public Model save(Model data) {
        try {
            logger.info("saving data" + data);
            return repo.save(data);
        } catch (Exception e) {
            logger.debug("getting error", e);
            return (Model) status(HttpStatus.BAD_REQUEST);
        }
    }

    public String gettingData(String id){
        logger.info("getting data from db"+id);
        return repo.findById(id).toString();
    }

    public String deletingData(String id) {
        logger.info("Deleting data from db" + id);
        repo.deleteById(id);
        return "Deleted Successfully";
    }


    public Model updateModelData(Model updateData) {
        Model exsistingModel = repo.findById(updateData.getId()).orElse(null);
        if(exsistingModel == null){
            throw new RuntimeException( "model not found by id"+ updateData );
        }
        exsistingModel.setAge(updateData.getAge());
        exsistingModel.setDob(updateData.getDob());
        exsistingModel.setName(updateData.getName());
        exsistingModel.setGender(updateData.getGender());
        logger.info("updating data");
        return repo.save(exsistingModel);
    }
}
