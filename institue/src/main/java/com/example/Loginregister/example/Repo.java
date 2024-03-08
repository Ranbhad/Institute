package com.example.Loginregister.example;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@EnableMongoRepositories
public interface Repo extends MongoRepository <Model,String> {

    Optional<Model> findById(String id);

}
