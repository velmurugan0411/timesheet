package com.techfinite.timesheet.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.techfinite.timesheet.IntegrationTest;
import com.techfinite.timesheet.domain.UserTask;
import com.techfinite.timesheet.repository.UserTaskRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link UserTaskResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserTaskResourceIT {

    private static final Long DEFAULT_USER_ID = 1L;
    private static final Long UPDATED_USER_ID = 2L;

    private static final Long DEFAULT_TASK_ID = 1L;
    private static final Long UPDATED_TASK_ID = 2L;

    private static final String ENTITY_API_URL = "/api/user-tasks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{userTaskId}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserTaskRepository userTaskRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserTaskMockMvc;

    private UserTask userTask;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserTask createEntity(EntityManager em) {
        UserTask userTask = new UserTask().userId(DEFAULT_USER_ID).taskId(DEFAULT_TASK_ID);
        return userTask;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserTask createUpdatedEntity(EntityManager em) {
        UserTask userTask = new UserTask().userId(UPDATED_USER_ID).taskId(UPDATED_TASK_ID);
        return userTask;
    }

    @BeforeEach
    public void initTest() {
        userTask = createEntity(em);
    }

    @Test
    @Transactional
    void createUserTask() throws Exception {
        int databaseSizeBeforeCreate = userTaskRepository.findAll().size();
        // Create the UserTask
        restUserTaskMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userTask)))
            .andExpect(status().isCreated());

        // Validate the UserTask in the database
        List<UserTask> userTaskList = userTaskRepository.findAll();
        assertThat(userTaskList).hasSize(databaseSizeBeforeCreate + 1);
        UserTask testUserTask = userTaskList.get(userTaskList.size() - 1);
        assertThat(testUserTask.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testUserTask.getTaskId()).isEqualTo(DEFAULT_TASK_ID);
    }

    @Test
    @Transactional
    void createUserTaskWithExistingId() throws Exception {
        // Create the UserTask with an existing ID
        userTask.setUserTaskId(1L);

        int databaseSizeBeforeCreate = userTaskRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserTaskMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userTask)))
            .andExpect(status().isBadRequest());

        // Validate the UserTask in the database
        List<UserTask> userTaskList = userTaskRepository.findAll();
        assertThat(userTaskList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkUserIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = userTaskRepository.findAll().size();
        // set the field null
        userTask.setUserId(null);

        // Create the UserTask, which fails.

        restUserTaskMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userTask)))
            .andExpect(status().isBadRequest());

        List<UserTask> userTaskList = userTaskRepository.findAll();
        assertThat(userTaskList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTaskIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = userTaskRepository.findAll().size();
        // set the field null
        userTask.setTaskId(null);

        // Create the UserTask, which fails.

        restUserTaskMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userTask)))
            .andExpect(status().isBadRequest());

        List<UserTask> userTaskList = userTaskRepository.findAll();
        assertThat(userTaskList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUserTasks() throws Exception {
        // Initialize the database
        userTaskRepository.saveAndFlush(userTask);

        // Get all the userTaskList
        restUserTaskMockMvc
            .perform(get(ENTITY_API_URL + "?sort=userTaskId,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].userTaskId").value(hasItem(userTask.getUserTaskId().intValue())))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID.intValue())))
            .andExpect(jsonPath("$.[*].taskId").value(hasItem(DEFAULT_TASK_ID.intValue())));
    }

    @Test
    @Transactional
    void getUserTask() throws Exception {
        // Initialize the database
        userTaskRepository.saveAndFlush(userTask);

        // Get the userTask
        restUserTaskMockMvc
            .perform(get(ENTITY_API_URL_ID, userTask.getUserTaskId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.userTaskId").value(userTask.getUserTaskId().intValue()))
            .andExpect(jsonPath("$.userId").value(DEFAULT_USER_ID.intValue()))
            .andExpect(jsonPath("$.taskId").value(DEFAULT_TASK_ID.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingUserTask() throws Exception {
        // Get the userTask
        restUserTaskMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUserTask() throws Exception {
        // Initialize the database
        userTaskRepository.saveAndFlush(userTask);

        int databaseSizeBeforeUpdate = userTaskRepository.findAll().size();

        // Update the userTask
        UserTask updatedUserTask = userTaskRepository.findById(userTask.getUserTaskId()).get();
        // Disconnect from session so that the updates on updatedUserTask are not directly saved in db
        em.detach(updatedUserTask);
        updatedUserTask.userId(UPDATED_USER_ID).taskId(UPDATED_TASK_ID);

        restUserTaskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserTask.getUserTaskId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserTask))
            )
            .andExpect(status().isOk());

        // Validate the UserTask in the database
        List<UserTask> userTaskList = userTaskRepository.findAll();
        assertThat(userTaskList).hasSize(databaseSizeBeforeUpdate);
        UserTask testUserTask = userTaskList.get(userTaskList.size() - 1);
        assertThat(testUserTask.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testUserTask.getTaskId()).isEqualTo(UPDATED_TASK_ID);
    }

    @Test
    @Transactional
    void putNonExistingUserTask() throws Exception {
        int databaseSizeBeforeUpdate = userTaskRepository.findAll().size();
        userTask.setUserTaskId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserTaskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userTask.getUserTaskId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userTask))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserTask in the database
        List<UserTask> userTaskList = userTaskRepository.findAll();
        assertThat(userTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserTask() throws Exception {
        int databaseSizeBeforeUpdate = userTaskRepository.findAll().size();
        userTask.setUserTaskId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserTaskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userTask))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserTask in the database
        List<UserTask> userTaskList = userTaskRepository.findAll();
        assertThat(userTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserTask() throws Exception {
        int databaseSizeBeforeUpdate = userTaskRepository.findAll().size();
        userTask.setUserTaskId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserTaskMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userTask)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserTask in the database
        List<UserTask> userTaskList = userTaskRepository.findAll();
        assertThat(userTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserTaskWithPatch() throws Exception {
        // Initialize the database
        userTaskRepository.saveAndFlush(userTask);

        int databaseSizeBeforeUpdate = userTaskRepository.findAll().size();

        // Update the userTask using partial update
        UserTask partialUpdatedUserTask = new UserTask();
        partialUpdatedUserTask.setUserTaskId(userTask.getUserTaskId());

        restUserTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserTask.getUserTaskId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserTask))
            )
            .andExpect(status().isOk());

        // Validate the UserTask in the database
        List<UserTask> userTaskList = userTaskRepository.findAll();
        assertThat(userTaskList).hasSize(databaseSizeBeforeUpdate);
        UserTask testUserTask = userTaskList.get(userTaskList.size() - 1);
        assertThat(testUserTask.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testUserTask.getTaskId()).isEqualTo(DEFAULT_TASK_ID);
    }

    @Test
    @Transactional
    void fullUpdateUserTaskWithPatch() throws Exception {
        // Initialize the database
        userTaskRepository.saveAndFlush(userTask);

        int databaseSizeBeforeUpdate = userTaskRepository.findAll().size();

        // Update the userTask using partial update
        UserTask partialUpdatedUserTask = new UserTask();
        partialUpdatedUserTask.setUserTaskId(userTask.getUserTaskId());

        partialUpdatedUserTask.userId(UPDATED_USER_ID).taskId(UPDATED_TASK_ID);

        restUserTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserTask.getUserTaskId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserTask))
            )
            .andExpect(status().isOk());

        // Validate the UserTask in the database
        List<UserTask> userTaskList = userTaskRepository.findAll();
        assertThat(userTaskList).hasSize(databaseSizeBeforeUpdate);
        UserTask testUserTask = userTaskList.get(userTaskList.size() - 1);
        assertThat(testUserTask.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testUserTask.getTaskId()).isEqualTo(UPDATED_TASK_ID);
    }

    @Test
    @Transactional
    void patchNonExistingUserTask() throws Exception {
        int databaseSizeBeforeUpdate = userTaskRepository.findAll().size();
        userTask.setUserTaskId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userTask.getUserTaskId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userTask))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserTask in the database
        List<UserTask> userTaskList = userTaskRepository.findAll();
        assertThat(userTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserTask() throws Exception {
        int databaseSizeBeforeUpdate = userTaskRepository.findAll().size();
        userTask.setUserTaskId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userTask))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserTask in the database
        List<UserTask> userTaskList = userTaskRepository.findAll();
        assertThat(userTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserTask() throws Exception {
        int databaseSizeBeforeUpdate = userTaskRepository.findAll().size();
        userTask.setUserTaskId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserTaskMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userTask)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserTask in the database
        List<UserTask> userTaskList = userTaskRepository.findAll();
        assertThat(userTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserTask() throws Exception {
        // Initialize the database
        userTaskRepository.saveAndFlush(userTask);

        int databaseSizeBeforeDelete = userTaskRepository.findAll().size();

        // Delete the userTask
        restUserTaskMockMvc
            .perform(delete(ENTITY_API_URL_ID, userTask.getUserTaskId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserTask> userTaskList = userTaskRepository.findAll();
        assertThat(userTaskList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
