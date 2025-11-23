package com.example.MainFolder.Config;

import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class DotEnvConfig_Old {

    private static final Logger logger = LoggerFactory.getLogger(DotEnvConfig_Old.class);

    @PostConstruct
    public void loadDotEnv() {
        try {
            // Load .env file from the Backend directory (project root)
            Dotenv dotenv = Dotenv.configure()
                    .directory("./")
                    .ignoreIfMissing()
                    .load();

            // Set system properties from .env file
            dotenv.entries().forEach(entry -> {
                String key = entry.getKey();
                String value = entry.getValue();
                
                // Only set if not already set as system property (environment variables take precedence)
                if (System.getProperty(key) == null && System.getenv(key) == null) {
                    System.setProperty(key, value);
                }
            });

            logger.info("✓ .env file loaded successfully");
            System.out.println("========== .ENV FILE LOADED ==========");
        } catch (Exception e) {
            logger.warn("Could not load .env file: {}. Using environment variables and defaults.", e.getMessage());
            System.out.println("========== .ENV FILE NOT FOUND (using defaults) ==========");
        }
    }
}

