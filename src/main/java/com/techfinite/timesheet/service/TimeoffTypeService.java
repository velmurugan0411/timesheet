package com.techfinite.timesheet.service;

import com.techfinite.timesheet.domain.TimeoffType;
import com.techfinite.timesheet.repository.TimeoffTypeRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link TimeoffType}.
 */
@Service
@Transactional
public class TimeoffTypeService {

    private final Logger log = LoggerFactory.getLogger(TimeoffTypeService.class);

    private final TimeoffTypeRepository timeoffTypeRepository;

    public TimeoffTypeService(TimeoffTypeRepository timeoffTypeRepository) {
        this.timeoffTypeRepository = timeoffTypeRepository;
    }

    /**
     * Save a timeoffType.
     *
     * @param timeoffType the entity to save.
     * @return the persisted entity.
     */
    public TimeoffType save(TimeoffType timeoffType) {
        log.debug("Request to save TimeoffType : {}", timeoffType);
        return timeoffTypeRepository.save(timeoffType);
    }

    /**
     * Update a timeoffType.
     *
     * @param timeoffType the entity to save.
     * @return the persisted entity.
     */
    public TimeoffType update(TimeoffType timeoffType) {
        log.debug("Request to save TimeoffType : {}", timeoffType);
        return timeoffTypeRepository.save(timeoffType);
    }

    /**
     * Partially update a timeoffType.
     *
     * @param timeoffType the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TimeoffType> partialUpdate(TimeoffType timeoffType) {
        log.debug("Request to partially update TimeoffType : {}", timeoffType);

        return timeoffTypeRepository
            .findById(timeoffType.getTimeoffTypeId())
            .map(existingTimeoffType -> {
                if (timeoffType.getTypeName() != null) {
                    existingTimeoffType.setTypeName(timeoffType.getTypeName());
                }

                return existingTimeoffType;
            })
            .map(timeoffTypeRepository::save);
    }

    /**
     * Get all the timeoffTypes.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<TimeoffType> findAll() {
        log.debug("Request to get all TimeoffTypes");
        return timeoffTypeRepository.findAll();
    }

    /**
     * Get one timeoffType by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TimeoffType> findOne(Long id) {
        log.debug("Request to get TimeoffType : {}", id);
        return timeoffTypeRepository.findById(id);
    }

    /**
     * Delete the timeoffType by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete TimeoffType : {}", id);
        timeoffTypeRepository.deleteById(id);
    }
}
