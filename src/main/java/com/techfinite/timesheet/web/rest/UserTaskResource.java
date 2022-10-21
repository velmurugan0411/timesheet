package com.techfinite.timesheet.web.rest;

import com.techfinite.timesheet.domain.UserTask;
import com.techfinite.timesheet.repository.UserTaskRepository;
import com.techfinite.timesheet.service.UserTaskService;
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
 * REST controller for managing {@link com.techfinite.timesheet.domain.UserTask}.
 */
@RestController
@RequestMapping("/api")
public class UserTaskResource {

    private final Logger log = LoggerFactory.getLogger(UserTaskResource.class);

    private static final String ENTITY_NAME = "userTask";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserTaskService userTaskService;

    private final UserTaskRepository userTaskRepository;

    public UserTaskResource(UserTaskService userTaskService, UserTaskRepository userTaskRepository) {
        this.userTaskService = userTaskService;
        this.userTaskRepository = userTaskRepository;
    }

    /**
     * {@code POST  /user-tasks} : Create a new userTask.
     *
     * @param userTask the userTask to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userTask, or with status {@code 400 (Bad Request)} if the userTask has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-tasks")
    public ResponseEntity<UserTask> createUserTask(@Valid @RequestBody UserTask userTask) throws URISyntaxException {
        log.debug("REST request to save UserTask : {}", userTask);
        if (userTask.getUserTaskId() != null) {
            throw new BadRequestAlertException("A new userTask cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserTask result = userTaskService.save(userTask);
        return ResponseEntity
            .created(new URI("/api/user-tasks/" + result.getUserTaskId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getUserTaskId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-tasks/:userTaskId} : Updates an existing userTask.
     *
     * @param userTaskId the id of the userTask to save.
     * @param userTask the userTask to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userTask,
     * or with status {@code 400 (Bad Request)} if the userTask is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userTask couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-tasks/{userTaskId}")
    public ResponseEntity<UserTask> updateUserTask(
        @PathVariable(value = "userTaskId", required = false) final Long userTaskId,
        @Valid @RequestBody UserTask userTask
    ) throws URISyntaxException {
        log.debug("REST request to update UserTask : {}, {}", userTaskId, userTask);
        if (userTask.getUserTaskId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(userTaskId, userTask.getUserTaskId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userTaskRepository.existsById(userTaskId)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserTask result = userTaskService.update(userTask);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userTask.getUserTaskId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-tasks/:userTaskId} : Partial updates given fields of an existing userTask, field will ignore if it is null
     *
     * @param userTaskId the id of the userTask to save.
     * @param userTask the userTask to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userTask,
     * or with status {@code 400 (Bad Request)} if the userTask is not valid,
     * or with status {@code 404 (Not Found)} if the userTask is not found,
     * or with status {@code 500 (Internal Server Error)} if the userTask couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-tasks/{userTaskId}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserTask> partialUpdateUserTask(
        @PathVariable(value = "userTaskId", required = false) final Long userTaskId,
        @NotNull @RequestBody UserTask userTask
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserTask partially : {}, {}", userTaskId, userTask);
        if (userTask.getUserTaskId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(userTaskId, userTask.getUserTaskId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userTaskRepository.existsById(userTaskId)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserTask> result = userTaskService.partialUpdate(userTask);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userTask.getUserTaskId().toString())
        );
    }

    /**
     * {@code GET  /user-tasks} : get all the userTasks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userTasks in body.
     */
    @GetMapping("/user-tasks")
    public List<UserTask> getAllUserTasks() {
        log.debug("REST request to get all UserTasks");
        return userTaskService.findAll();
    }

    /**
     * {@code GET  /user-tasks/:id} : get the "id" userTask.
     *
     * @param id the id of the userTask to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userTask, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-tasks/{id}")
    public ResponseEntity<UserTask> getUserTask(@PathVariable Long id) {
        log.debug("REST request to get UserTask : {}", id);
        Optional<UserTask> userTask = userTaskService.findOne(id);
        return ResponseUtil.wrapOrNotFound(userTask);
    }

    /**
     * {@code DELETE  /user-tasks/:id} : delete the "id" userTask.
     *
     * @param id the id of the userTask to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-tasks/{id}")
    public ResponseEntity<Void> deleteUserTask(@PathVariable Long id) {
        log.debug("REST request to delete UserTask : {}", id);
        userTaskService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
