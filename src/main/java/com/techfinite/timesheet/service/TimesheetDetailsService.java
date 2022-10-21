package com.techfinite.timesheet.service;

import com.techfinite.timesheet.domain.TimesheetDetails;
import com.techfinite.timesheet.repository.TimesheetDetailsRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link TimesheetDetails}.
 */
@Service
@Transactional
public class TimesheetDetailsService {

    private final Logger log = LoggerFactory.getLogger(TimesheetDetailsService.class);

    private final TimesheetDetailsRepository timesheetDetailsRepository;

    public TimesheetDetailsService(TimesheetDetailsRepository timesheetDetailsRepository) {
        this.timesheetDetailsRepository = timesheetDetailsRepository;
    }

    /**
     * Save a timesheetDetails.
     *
     * @param timesheetDetails the entity to save.
     * @return the persisted entity.
     */
    public TimesheetDetails save(TimesheetDetails timesheetDetails) {
        log.debug("Request to save TimesheetDetails : {}", timesheetDetails);
        return timesheetDetailsRepository.save(timesheetDetails);
    }

    /**
     * Update a timesheetDetails.
     *
     * @param timesheetDetails the entity to save.
     * @return the persisted entity.
     */
    public TimesheetDetails update(TimesheetDetails timesheetDetails) {
        log.debug("Request to save TimesheetDetails : {}", timesheetDetails);
        return timesheetDetailsRepository.save(timesheetDetails);
    }

    /**
     * Partially update a timesheetDetails.
     *
     * @param timesheetDetails the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TimesheetDetails> partialUpdate(TimesheetDetails timesheetDetails) {
        log.debug("Request to partially update TimesheetDetails : {}", timesheetDetails);

        return timesheetDetailsRepository
            .findById(timesheetDetails.getTimesheetDetailsId())
            .map(existingTimesheetDetails -> {
                if (timesheetDetails.getWorkdate() != null) {
                    existingTimesheetDetails.setWorkdate(timesheetDetails.getWorkdate());
                }
                if (timesheetDetails.getHours() != null) {
                    existingTimesheetDetails.setHours(timesheetDetails.getHours());
                }

                return existingTimesheetDetails;
            })
            .map(timesheetDetailsRepository::save);
    }

    /**
     * Get all the timesheetDetails.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<TimesheetDetails> findAll() {
        log.debug("Request to get all TimesheetDetails");
        return timesheetDetailsRepository.findAll();
    }

    /**
     * Get one timesheetDetails by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TimesheetDetails> findOne(Long id) {
        log.debug("Request to get TimesheetDetails : {}", id);
        return timesheetDetailsRepository.findById(id);
    }

    /**
     * Delete the timesheetDetails by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete TimesheetDetails : {}", id);
        timesheetDetailsRepository.deleteById(id);
    }
}
