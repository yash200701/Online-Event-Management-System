package com.eventmanagement.backend.service;

import com.eventmanagement.backend.entity.Event;
import com.eventmanagement.backend.repository.EventRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = Objects.requireNonNull(eventRepository);
    }

    // Get all events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Get event by ID
    public Optional<Event> getEventById(Long id) {

        Objects.requireNonNull(id, "Event ID cannot be null");

        return eventRepository.findById(id);
    }

    // Create event
    public Event createEvent(Event event) {

        Objects.requireNonNull(event, "Event cannot be null");

        return eventRepository.save(event);
    }

    // Update event
    public Event updateEvent(Long id, Event event) {

        Objects.requireNonNull(id, "Event ID cannot be null");
        Objects.requireNonNull(event, "Event cannot be null");

        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));

        existingEvent.setTitle(event.getTitle());
        existingEvent.setDescription(event.getDescription());
        existingEvent.setLocation(event.getLocation());
        existingEvent.setDate(event.getDate());
        existingEvent.setTime(event.getTime());
        existingEvent.setCategory(event.getCategory());
        existingEvent.setCapacity(event.getCapacity());

        return eventRepository.save(existingEvent);
    }

    // Delete event
    public void deleteEvent(Long id) {

        Objects.requireNonNull(id, "Event ID cannot be null");

        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found with ID: " + id);
        }

        eventRepository.deleteById(id);
    }
}