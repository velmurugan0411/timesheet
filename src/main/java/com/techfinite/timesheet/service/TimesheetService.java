package com.techfinite.timesheet.service;

import com.techfinite.timesheet.domain.Timesheet;
import com.techfinite.timesheet.repository.TimesheetRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Timesheet}.
 */
@Service
@Transactional
public class TimesheetService {

    private final Logger log = LoggerFactory.getLogger(TimesheetService.class);

    private final TimesheetRepository timesheetRepository;

    public TimesheetService(TimesheetRepository timesheetRepository) {
        this.timesheetRepository = timesheetRepository;
    }

    /**
     * Save a timesheet.
     *
     * @param timesheet the entity to save.
     * @return the persisted entity.
     */
    public Timesheet save(Timesheet timesheet) {
        log.debug("Request to save Timesheet : {}", timesheet);
        return timesheetRepository.save(timesheet);
    }

    /**
     * Update a timesheet.
     *
     * @param timesheet the entity to save.
     * @return the persisted entity.
     */
    public Timesheet update(Timesheet timesheet) {
        log.debug("Request to save Timesheet : {}", timesheet);
        return timesheetRepository.save(timesheet);
    }

    /**
     * Partially update a timesheet.
     *
     * @param timesheet the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Timesheet> partialUpdate(Timesheet timesheet) {
        log.debug("Request to partially update Timesheet : {}", timesheet);

        return timesheetRepository
            .findById(timesheet.getTimesheetId())
            .map(existingTimesheet -> {
                if (timesheet.getPeriodStartingDate() != null) {
                    existingTimesheet.setPeriodStartingDate(timesheet.getPeriodStartingDate());
                }
                if (timesheet.getPeriodEndingDate() != null) {
                    existingTimesheet.setPeriodEndingDate(timesheet.getPeriodEndingDate());
                }
                if (timesheet.getNotes() != null) {
                    existingTimesheet.setNotes(timesheet.getNotes());
                }

                return existingTimesheet;
            })
            .map(timesheetRepository::save);
    }

    /**
     * Get all the timesheets.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Timesheet> findAll() {
        log.debug("Request to get all Timesheets");
        return timesheetRepository.findAll();
    }

    /**
     * Get one timesheet by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Timesheet> findOne(Long id) {
        log.debug("Request to get Timesheet : {}", id);
        return timesheetRepository.findById(id);
    }

    /**
     * Delete the timesheet by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Timesheet : {}", id);
        timesheetRepository.deleteById(id);
    }
}
