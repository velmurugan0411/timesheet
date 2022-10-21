package com.techfinite.timesheet.web.rest;

import com.techfinite.timesheet.domain.TimesheetDetails;
import com.techfinite.timesheet.repository.TimesheetDetailsRepository;
import com.techfinite.timesheet.service.TimesheetDetailsService;
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
 * REST controller for managing {@link com.techfinite.timesheet.domain.TimesheetDetails}.
 */
@RestController
@RequestMapping("/api")
public class TimesheetDetailsResource {

    private final Logger log = LoggerFactory.getLogger(TimesheetDetailsResource.class);

    private static final String ENTITY_NAME = "timesheetDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TimesheetDetailsService timesheetDetailsService;

    private final TimesheetDetailsRepository timesheetDetailsRepository;

    public TimesheetDetailsResource(
        TimesheetDetailsService timesheetDetailsService,
        TimesheetDetailsRepository timesheetDetailsRepository
    ) {
        this.timesheetDetailsService = timesheetDetailsService;
        this.timesheetDetailsRepository = timesheetDetailsRepository;
    }

    /**
     * {@code POST  /timesheet-details} : Create a new timesheetDetails.
     *
     * @param timesheetDetails the timesheetDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new timesheetDetails, or with status {@code 400 (Bad Request)} if the timesheetDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/timesheet-details")
    public ResponseEntity<TimesheetDetails> createTimesheetDetails(@Valid @RequestBody TimesheetDetails timesheetDetails)
        throws URISyntaxException {
        log.debug("REST request to save TimesheetDetails : {}", timesheetDetails);
        if (timesheetDetails.getTimesheetDetailsId() != null) {
            throw new BadRequestAlertException("A new timesheetDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TimesheetDetails result = timesheetDetailsService.save(timesheetDetails);
        return ResponseEntity
            .created(new URI("/api/timesheet-details/" + result.getTimesheetDetailsId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getTimesheetDetailsId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /timesheet-details/:timesheetDetailsId} : Updates an existing timesheetDetails.
     *
     * @param timesheetDetailsId the id of the timesheetDetails to save.
     * @param timesheetDetails the timesheetDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated timesheetDetails,
     * or with status {@code 400 (Bad Request)} if the timesheetDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the timesheetDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/timesheet-details/{timesheetDetailsId}")
    public ResponseEntity<TimesheetDetails> updateTimesheetDetails(
        @PathVariable(value = "timesheetDetailsId", required = false) final Long timesheetDetailsId,
        @Valid @RequestBody TimesheetDetails timesheetDetails
    ) throws URISyntaxException {
        log.debug("REST request to update TimesheetDetails : {}, {}", timesheetDetailsId, timesheetDetails);
        if (timesheetDetails.getTimesheetDetailsId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(timesheetDetailsId, timesheetDetails.getTimesheetDetailsId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!timesheetDetailsRepository.existsById(timesheetDetailsId)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TimesheetDetails result = timesheetDetailsService.update(timesheetDetails);
        return ResponseEntity
            .ok()
            .headers(
                HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, timesheetDetails.getTimesheetDetailsId().toString())
            )
            .body(result);
    }

    /**
     * {@code PATCH  /timesheet-details/:timesheetDetailsId} : Partial updates given fields of an existing timesheetDetails, field will ignore if it is null
     *
     * @param timesheetDetailsId the id of the timesheetDetails to save.
     * @param timesheetDetails the timesheetDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated timesheetDetails,
     * or with status {@code 400 (Bad Request)} if the timesheetDetails is not valid,
     * or with status {@code 404 (Not Found)} if the timesheetDetails is not found,
     * or with status {@code 500 (Internal Server Error)} if the timesheetDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/timesheet-details/{timesheetDetailsId}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TimesheetDetails> partialUpdateTimesheetDetails(
        @PathVariable(value = "timesheetDetailsId", required = false) final Long timesheetDetailsId,
        @NotNull @RequestBody TimesheetDetails timesheetDetails
    ) throws URISyntaxException {
        log.debug("REST request to partial update TimesheetDetails partially : {}, {}", timesheetDetailsId, timesheetDetails);
        if (timesheetDetails.getTimesheetDetailsId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(timesheetDetailsId, timesheetDetails.getTimesheetDetailsId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!timesheetDetailsRepository.existsById(timesheetDetailsId)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TimesheetDetails> result = timesheetDetailsService.partialUpdate(timesheetDetails);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, timesheetDetails.getTimesheetDetailsId().toString())
        );
    }

    /**
     * {@code GET  /timesheet-details} : get all the timesheetDetails.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of timesheetDetails in body.
     */
    @GetMapping("/timesheet-details")
    public List<TimesheetDetails> getAllTimesheetDetails() {
        log.debug("REST request to get all TimesheetDetails");
        return timesheetDetailsService.findAll();
    }

    /**
     * {@code GET  /timesheet-details/:id} : get the "id" timesheetDetails.
     *
     * @param id the id of the timesheetDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the timesheetDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/timesheet-details/{id}")
    public ResponseEntity<TimesheetDetails> getTimesheetDetails(@PathVariable Long id) {
        log.debug("REST request to get TimesheetDetails : {}", id);
        Optional<TimesheetDetails> timesheetDetails = timesheetDetailsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(timesheetDetails);
    }

    /**
     * {@code DELETE  /timesheet-details/:id} : delete the "id" timesheetDetails.
     *
     * @param id the id of the timesheetDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/timesheet-details/{id}")
    public ResponseEntity<Void> deleteTimesheetDetails(@PathVariable Long id) {
        log.debug("REST request to delete TimesheetDetails : {}", id);
        timesheetDetailsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
