package com.soft.photo_qr.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.soft.photo_qr.model.Photo;
import com.soft.photo_qr.repository.PhotoRepository;

@Service
public class PhotoService {

    private final Cloudinary cloudinary;
    private final PhotoRepository photoRepository;

    public PhotoService(Cloudinary cloudinary, PhotoRepository photoRepository) {
        this.cloudinary = cloudinary;
        this.photoRepository = photoRepository;
    }

    public List<Photo> getAllPhotos() {
        return photoRepository.findAll();
    }

    public Photo uploadImage(String name, MultipartFile file) {
        try {
            System.out.println("UPLOAD STARTED");
            System.out.println("File name: " + file.getOriginalFilename());

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
           // Map uploadResult = cloudinary.uploader().upload(file.getInputStream(), ObjectUtils.asMap("resource_type", "auto"));

            System.out.println("UPLOAD SUCCESS");

            String url = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            Photo photo = new Photo();
            photo.setName(name);
            photo.setImageUrl(url);
            photo.setPublicId(publicId);

            // photo.setName(name);
            // photo.setImageUrl(uploadResult.get("secure_url").toString());
            // photo.setPublicId(uploadResult.get("public_id").toString());

            return photoRepository.save(photo);

        } catch (Exception e) {
            e.printStackTrace(); // 🔥 VERY IMPORTANT
            throw new RuntimeException("Upload failed: " + e.getMessage());
        }
    }

    public Photo getPhoto(String id) {
        return photoRepository.findById(id).orElseThrow(() -> new RuntimeException("Photo not found"));
    }

    public void deletePhoto(String id) throws IOException {
        Photo photo = photoRepository.findById(id).orElseThrow(() -> new RuntimeException("Photo not found"));

        cloudinary.uploader().destroy(photo.getPublicId(), ObjectUtils.emptyMap());
        photoRepository.delete(photo);
    }

    public Photo updatePhoto(String id, String name, MultipartFile file) throws IOException {
        Photo photo = photoRepository.findById(id).orElseThrow(() -> new RuntimeException("Photo not found"));

        // Delete old image from Cloudinary
        if (photo.getPublicId() != null) {
            cloudinary.uploader().destroy(photo.getPublicId(), ObjectUtils.emptyMap());
        }

        // Upload new image
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());

        photo.setName(name);
        photo.setImageUrl(uploadResult.get("secure_url").toString());
        photo.setPublicId(uploadResult.get("public_id").toString());
        
        return photoRepository.save(photo);
    }


}
