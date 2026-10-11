package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {

}