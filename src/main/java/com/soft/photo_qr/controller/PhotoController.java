package com.soft.photo_qr.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.soft.photo_qr.model.Photo;
import com.soft.photo_qr.service.PhotoService;
import com.soft.photo_qr.utils.GenerateQrCode;


@RestController
@RequestMapping("/api/photo")
@CrossOrigin(origins = "*")
public class PhotoController {

    @Autowired
    PhotoService photoService;

    @GetMapping
    public ResponseEntity<List<Photo>> getAllPhotos() {
        return ResponseEntity.ok(photoService.getAllPhotos());
    }

    @PostMapping(value ="/upload",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadPhoto(@RequestParam("name") String name, @RequestParam("file") MultipartFile file) {
        try {
            Photo savedPhoto = photoService.uploadImage(name,file);
            return ResponseEntity.ok(savedPhoto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Photo> getPhoto(@PathVariable String id) {
        Photo photo = photoService.getPhoto(id);
        return ResponseEntity.ok(photo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePhoto(@PathVariable String id, @RequestParam("name") String name, @RequestParam("file") MultipartFile file) {
        try {
            Photo savedPhoto = photoService.updatePhoto(id,name,file);
            return ResponseEntity.ok(savedPhoto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePhoto(@PathVariable String id) {
        try {
            photoService.deletePhoto(id);
            return ResponseEntity.ok("Photo deleted");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Delete failed");
        }
    }

    @GetMapping(value = "/generate/{id}", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] generateQR(@PathVariable String id) throws Exception {
        Photo photo = photoService.getPhoto(id);
        String text = photo.getImageUrl();
        return GenerateQrCode.qrGenrater(text, 250, 250);
    }

}
