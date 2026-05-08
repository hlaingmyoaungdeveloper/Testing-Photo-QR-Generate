package com.soft.photo_qr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.soft.photo_qr.model.Photo;

@Repository
public interface PhotoRepository extends JpaRepository<Photo,String> {

}
