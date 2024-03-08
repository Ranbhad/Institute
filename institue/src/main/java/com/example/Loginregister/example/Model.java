package com.example.Loginregister.example;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.Date;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "ex")
public class Model {
    @Id
    private String id;
    private String name;
    private int age;
    private Date dob;
    private String gender;
}
