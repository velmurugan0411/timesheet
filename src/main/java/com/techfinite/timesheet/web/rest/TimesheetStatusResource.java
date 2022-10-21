package com.techfinite.timesheet.web.rest;

import com.techfinite.timesheet.domain.TimesheetStatus;
import com.techfinite.timesheet.repository.TimesheetStatusRepository;
import com.techfinite.timesheet.service.TimesheetStatusService;
import com.techfinite.timesheet.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.techfinite.timesheet.domain.TimesheetStatus}.
 */
@RestController
@RequestMapping("/api")
public class TimesheetStatusResource {

    private final Logger log = LoggerFactory.getLogger(TimesheetStatusResource.class);

    private static final String ENTITY_NAME = "timesheetStatus";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TimesheetStatusService timesheetStatusService;

    private final TimesheetStatusRepository timesheetStatusRepository;

    public TimesheetStatusResource(TimesheetStatusService timesheetStatusService, TimesheetStatusRepository timesheetStatusRepository) {
        this.timesheetStatusService = timesheetStatusService;
        this.timesheetStatusRepository = timesheetStatusRepository;
    }

    /**
     * {@code POST  /timesheet-statuses} : Create a new timesheetStatus.
     *
     * @param timesheetStatus the timesheetStatus to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new timesheetStatus, or with status {@code 400 (Bad Request)} if the timesheetStatus has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/timesheet-statuses")
    public ResponseEntity<TimesheetStatus> createTimesheetStatus(@Valid @RequestBody TimesheetStatus timesheetStatus)
        throws URISyntaxException {
        log.debug("REST request to save TimesheetStatus : {}", timesheetStatus);
        if (timesheetStatus.getTimesheetStatusId() != null) {
            throw new BadRequestAlertException("A new timesheetStatus cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TimesheetStatus result = timesheetStatusService.save(timesheetStatus);
        return ResponseEntity
            .created(new URI("/api/timesheet-statuses/" + result.getTimesheetStatusId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getTimesheetStatusId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /timesheet-statuses/:timesheetStatusId} : Updates an existing timesheetStatus.
     *
     * @param timesheetStatusId the id of the timesheetStatus to save.
     * @param timesheetStatus the timesheetStatus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated timesheetStatus,
     * or with status {@code 400 (Bad Request)} if the timesheetStatus is not valid,
     * or with status {@code 500 (Internal Server Error)} if the timesheetStatus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/timesheet-statuses/{timesheetStatusId}")
    public ResponseEntity<TimesheetStatus> updateTimesheetStatus(
        @PathVariable(value = "timesheetStatusId", required = false) final Long timesheetStatusId,
        @Valid @RequestBody TimesheetStatus timesheetStatus
    ) throws URISyntaxException {
        log.debug("REST request to update TimesheetStatus : {}, {}", timesheetStatusId, timesheetStatus);
        if (timesheetStatus.getTimesheetStatusId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(timesheetStatusId, timesheetStatus.getTimesheetStatusId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!timesheetStatusRepository.existsById(timesheetStatusId)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TimesheetStatus result = timesheetStatusService.update(timesheetStatus);
        return ResponseEntity
            .ok()
            .headers(
                HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, timesheetStatus.getTimesheetStatusId().toString())
            )
            .body(result);
    }

    /**
     * {@code PATCH  /timesheet-statuses/:timesheetStatusId} : Partial updates given fields of an existing timesheetStatus, field will ignore if it is null
     *
     * @param timesheetStatusId the id of the timesheetStatus to save.
     * @param timesheetStatus the timesheetStatus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated timesheetStatus,
     * or with status {@code 400 (Bad Request)} if the timesheetStatus is not valid,
     * or with status {@code 404 (Not Found)} if the timesheetStatus is not found,
     * or with status {@code 500 (Internal Server Error)} if the timesheetStatus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/timesheet-statuses/{timesheetStatusId}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TimesheetStatus> partialUpdateTimesheetStatus(
        @PathVariable(value = "timesheetStatusId", required = false) final Long timesheetStatusId,
        @NotNull @RequestBody TimesheetStatus timesheetStatus
    ) throws URISyntaxException {
        log.debug("REST request to partial update TimesheetStatus partially : {}, {}", timesheetStatusId, timesheetStatus);
        if (timesheetStatus.getTimesheetStatusId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(timesheetStatusId, timesheetStatus.getTimesheetStatusId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!timesheetStatusRepository.existsById(timesheetStatusId)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TimesheetStatus> result = timesheetStatusService.partialUpdate(timesheetStatus);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, timesheetStatus.getTimesheetStatusId().toString())
        );
    }

    /**
     * {@code GET  /timesheet-statuses} : get all the timesheetStatuses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of timesheetStatuses in body.
     */
    @GetMapping("/timesheet-statuses")
    public List<TimesheetStatus> getAllTimesheetStatuses() {
        log.debug("REST request to get all TimesheetStatuses");
        return timesheetStatusService.findAll();
    }

    /**
     * {@code GET  /timesheet-statuses/:id} : get the "id" timesheetStatus.
     *
     * @param id the id of the timesheetStatus to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the timesheetStatus, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/timesheet-statuses/{id}")
    public ResponseEntity<TimesheetStatus> getTimesheetStatus(@PathVariable Long id) {
        log.debug("REST request to get TimesheetStatus : {}", id);
        Optional<TimesheetStatus> timesheetStatus = timesheetStatusService.findOne(id);
        return ResponseUtil.wrapOrNotFound(timesheetStatus);
    }

    /**
     * {@code DELETE  /timesheet-statuses/:id} : delete the "id" timesheetStatus.
     *
     * @param id the id of the timesheetStatus to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/timesheet-statuses/{id}")
    public ResponseEntity<Void> deleteTimesheetStatus(@PathVariable Long id) {
        log.debug("REST request to delete TimesheetStatus : {}", id);
        timesheetStatusService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
