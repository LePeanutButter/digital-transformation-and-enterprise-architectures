package com.tdse.stream.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class StreamController {
    
    @GetMapping("/stream")
    public Map<String, Object> getStream() {
        return Collections.singletonMap("message", "Stream Service is running");
    }
}
