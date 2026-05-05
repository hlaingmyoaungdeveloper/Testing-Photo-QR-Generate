package com.soft.photo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.soft.photo.model.Photo;

@Repository
public interface PhotoRepository extends JpaRepository<Photo,String> {

}
