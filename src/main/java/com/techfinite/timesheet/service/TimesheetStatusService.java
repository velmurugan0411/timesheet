package com.techfinite.timesheet.service;

import com.techfinite.timesheet.domain.TimesheetStatus;
import com.techfinite.timesheet.repository.TimesheetStatusRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link TimesheetStatus}.
 */
@Service
@Transactional
public class TimesheetStatusService {

    private final Logger log = LoggerFactory.getLogger(TimesheetStatusService.class);

    private final TimesheetStatusRepository timesheetStatusRepository;

    public TimesheetStatusService(TimesheetStatusRepository timesheetStatusRepository) {
        this.timesheetStatusRepository = timesheetStatusRepository;
    }

    /**
     * Save a timesheetStatus.
     *
     * @param timesheetStatus the entity to save.
     * @return the persisted entity.
     */
    public TimesheetStatus save(TimesheetStatus timesheetStatus) {
        log.debug("Request to save TimesheetStatus : {}", timesheetStatus);
        return timesheetStatusRepository.save(timesheetStatus);
    }

    /**
     * Update a timesheetStatus.
     *
     * @param timesheetStatus the entity to save.
     * @return the persisted entity.
     */
    public TimesheetStatus update(TimesheetStatus timesheetStatus) {
        log.debug("Request to save TimesheetStatus : {}", timesheetStatus);
        return timesheetStatusRepository.save(timesheetStatus);
    }

    /**
     * Partially update a timesheetStatus.
     *
     * @param timesheetStatus the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TimesheetStatus> partialUpdate(TimesheetStatus timesheetStatus) {
        log.debug("Request to partially update TimesheetStatus : {}", timesheetStatus);

        return timesheetStatusRepository
            .findById(timesheetStatus.getTimesheetStatusId())
            .map(existingTimesheetStatus -> {
                if (timesheetStatus.getStatusName() != null) {
                    existingTimesheetStatus.setStatusName(timesheetStatus.getStatusName());
                }

                return existingTimesheetStatus;
            })
            .map(timesheetStatusRepository::save);
    }

    /**
     * Get all the timesheetStatuses.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<TimesheetStatus> findAll() {
        log.debug("Request to get all TimesheetStatuses");
        return timesheetStatusRepository.findAll();
    }

    /**
     * Get one timesheetStatus by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TimesheetStatus> findOne(Long id) {
        log.debug("Request to get TimesheetStatus : {}", id);
        return timesheetStatusRepository.findById(id);
    }

    /**
     * Delete the timesheetStatus by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete TimesheetStatus : {}", id);
        timesheetStatusRepository.deleteById(id);
    }
}
