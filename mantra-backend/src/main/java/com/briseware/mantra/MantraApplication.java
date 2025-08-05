package com.briseware.mantra;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class MantraApplication {

	public static void main(String[] args) {
		SpringApplication.run(MantraApplication.class, args);
	}

}
