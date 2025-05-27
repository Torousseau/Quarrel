// src/main/java/com/example/demo/controller/TestController.java

package com.quarrel.controller.demo;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:4200") // autorise Angular
public class TestController {

    @GetMapping
    public String ping() {
        return "Backend is working!";
    }
}
