package com.techfinite.timesheet.web.rest;

import com.techfinite.timesheet.domain.TimeoffType;
import com.techfinite.timesheet.repository.TimeoffTypeRepository;
import com.techfinite.timesheet.service.TimeoffTypeService;
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
 * REST controller for managing {@link com.techfinite.timesheet.domain.TimeoffType}.
 */
@RestController
@RequestMapping("/api")
public class TimeoffTypeResource {

    private final Logger log = LoggerFactory.getLogger(TimeoffTypeResource.class);

    private static final String ENTITY_NAME = "timeoffType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TimeoffTypeService timeoffTypeService;

    private final TimeoffTypeRepository timeoffTypeRepository;

    public TimeoffTypeResource(TimeoffTypeService timeoffTypeService, TimeoffTypeRepository timeoffTypeRepository) {
        this.timeoffTypeService = timeoffTypeService;
        this.timeoffTypeRepository = timeoffTypeRepository;
    }

    /**
     * {@code POST  /timeoff-types} : Create a new timeoffType.
     *
     * @param timeoffType the timeoffType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new timeoffType, or with status {@code 400 (Bad Request)} if the timeoffType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/timeoff-types")
    public ResponseEntity<TimeoffType> createTimeoffType(@Valid @RequestBody TimeoffType timeoffType) throws URISyntaxException {
        log.debug("REST request to save TimeoffType : {}", timeoffType);
        if (timeoffType.getTimeoffTypeId() != null) {
            throw new BadRequestAlertException("A new timeoffType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TimeoffType result = timeoffTypeService.save(timeoffType);
        return ResponseEntity
            .created(new URI("/api/timeoff-types/" + result.getTimeoffTypeId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getTimeoffTypeId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /timeoff-types/:timeoffTypeId} : Updates an existing timeoffType.
     *
     * @param timeoffTypeId the id of the timeoffType to save.
     * @param timeoffType the timeoffType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated timeoffType,
     * or with status {@code 400 (Bad Request)} if the timeoffType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the timeoffType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/timeoff-types/{timeoffTypeId}")
    public ResponseEntity<TimeoffType> updateTimeoffType(
        @PathVariable(value = "timeoffTypeId", required = false) final Long timeoffTypeId,
        @Valid @RequestBody TimeoffType timeoffType
    ) throws URISyntaxException {
        log.debug("REST request to update TimeoffType : {}, {}", timeoffTypeId, timeoffType);
        if (timeoffType.getTimeoffTypeId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(timeoffTypeId, timeoffType.getTimeoffTypeId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!timeoffTypeRepository.existsById(timeoffTypeId)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TimeoffType result = timeoffTypeService.update(timeoffType);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, timeoffType.getTimeoffTypeId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /timeoff-types/:timeoffTypeId} : Partial updates given fields of an existing timeoffType, field will ignore if it is null
     *
     * @param timeoffTypeId the id of the timeoffType to save.
     * @param timeoffType the timeoffType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated timeoffType,
     * or with status {@code 400 (Bad Request)} if the timeoffType is not valid,
     * or with status {@code 404 (Not Found)} if the timeoffType is not found,
     * or with status {@code 500 (Internal Server Error)} if the timeoffType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/timeoff-types/{timeoffTypeId}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TimeoffType> partialUpdateTimeoffType(
        @PathVariable(value = "timeoffTypeId", required = false) final Long timeoffTypeId,
        @NotNull @RequestBody TimeoffType timeoffType
    ) throws URISyntaxException {
        log.debug("REST request to partial update TimeoffType partially : {}, {}", timeoffTypeId, timeoffType);
        if (timeoffType.getTimeoffTypeId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(timeoffTypeId, timeoffType.getTimeoffTypeId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!timeoffTypeRepository.existsById(timeoffTypeId)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TimeoffType> result = timeoffTypeService.partialUpdate(timeoffType);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, timeoffType.getTimeoffTypeId().toString())
        );
    }

    /**
     * {@code GET  /timeoff-types} : get all the timeoffTypes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of timeoffTypes in body.
     */
    @GetMapping("/timeoff-types")
    public List<TimeoffType> getAllTimeoffTypes() {
        log.debug("REST request to get all TimeoffTypes");
        return timeoffTypeService.findAll();
    }

    /**
     * {@code GET  /timeoff-types/:id} : get the "id" timeoffType.
     *
     * @param id the id of the timeoffType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the timeoffType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/timeoff-types/{id}")
    public ResponseEntity<TimeoffType> getTimeoffType(@PathVariable Long id) {
        log.debug("REST request to get TimeoffType : {}", id);
        Optional<TimeoffType> timeoffType = timeoffTypeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(timeoffType);
    }

    /**
     * {@code DELETE  /timeoff-types/:id} : delete the "id" timeoffType.
     *
     * @param id the id of the timeoffType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/timeoff-types/{id}")
    public ResponseEntity<Void> deleteTimeoffType(@PathVariable Long id) {
        log.debug("REST request to delete TimeoffType : {}", id);
        timeoffTypeService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
