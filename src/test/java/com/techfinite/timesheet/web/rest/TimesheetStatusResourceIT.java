package com.techfinite.timesheet.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.techfinite.timesheet.IntegrationTest;
import com.techfinite.timesheet.domain.TimesheetStatus;
import com.techfinite.timesheet.repository.TimesheetStatusRepository;
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
 * Integration tests for the {@link TimesheetStatusResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TimesheetStatusResourceIT {

    private static final String DEFAULT_STATUS_NAME = "AAAAAAAAAA";
    private static final String UPDATED_STATUS_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/timesheet-statuses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{timesheetStatusId}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TimesheetStatusRepository timesheetStatusRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTimesheetStatusMockMvc;

    private TimesheetStatus timesheetStatus;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TimesheetStatus createEntity(EntityManager em) {
        TimesheetStatus timesheetStatus = new TimesheetStatus().statusName(DEFAULT_STATUS_NAME);
        return timesheetStatus;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TimesheetStatus createUpdatedEntity(EntityManager em) {
        TimesheetStatus timesheetStatus = new TimesheetStatus().statusName(UPDATED_STATUS_NAME);
        return timesheetStatus;
    }

    @BeforeEach
    public void initTest() {
        timesheetStatus = createEntity(em);
    }

    @Test
    @Transactional
    void createTimesheetStatus() throws Exception {
        int databaseSizeBeforeCreate = timesheetStatusRepository.findAll().size();
        // Create the TimesheetStatus
        restTimesheetStatusMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timesheetStatus))
            )
            .andExpect(status().isCreated());

        // Validate the TimesheetStatus in the database
        List<TimesheetStatus> timesheetStatusList = timesheetStatusRepository.findAll();
        assertThat(timesheetStatusList).hasSize(databaseSizeBeforeCreate + 1);
        TimesheetStatus testTimesheetStatus = timesheetStatusList.get(timesheetStatusList.size() - 1);
        assertThat(testTimesheetStatus.getStatusName()).isEqualTo(DEFAULT_STATUS_NAME);
    }

    @Test
    @Transactional
    void createTimesheetStatusWithExistingId() throws Exception {
        // Create the TimesheetStatus with an existing ID
        timesheetStatus.setTimesheetStatusId(1L);

        int databaseSizeBeforeCreate = timesheetStatusRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTimesheetStatusMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timesheetStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimesheetStatus in the database
        List<TimesheetStatus> timesheetStatusList = timesheetStatusRepository.findAll();
        assertThat(timesheetStatusList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTimesheetStatuses() throws Exception {
        // Initialize the database
        timesheetStatusRepository.saveAndFlush(timesheetStatus);

        // Get all the timesheetStatusList
        restTimesheetStatusMockMvc
            .perform(get(ENTITY_API_URL + "?sort=timesheetStatusId,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].timesheetStatusId").value(hasItem(timesheetStatus.getTimesheetStatusId().intValue())))
            .andExpect(jsonPath("$.[*].statusName").value(hasItem(DEFAULT_STATUS_NAME)));
    }

    @Test
    @Transactional
    void getTimesheetStatus() throws Exception {
        // Initialize the database
        timesheetStatusRepository.saveAndFlush(timesheetStatus);

        // Get the timesheetStatus
        restTimesheetStatusMockMvc
            .perform(get(ENTITY_API_URL_ID, timesheetStatus.getTimesheetStatusId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.timesheetStatusId").value(timesheetStatus.getTimesheetStatusId().intValue()))
            .andExpect(jsonPath("$.statusName").value(DEFAULT_STATUS_NAME));
    }

    @Test
    @Transactional
    void getNonExistingTimesheetStatus() throws Exception {
        // Get the timesheetStatus
        restTimesheetStatusMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTimesheetStatus() throws Exception {
        // Initialize the database
        timesheetStatusRepository.saveAndFlush(timesheetStatus);

        int databaseSizeBeforeUpdate = timesheetStatusRepository.findAll().size();

        // Update the timesheetStatus
        TimesheetStatus updatedTimesheetStatus = timesheetStatusRepository.findById(timesheetStatus.getTimesheetStatusId()).get();
        // Disconnect from session so that the updates on updatedTimesheetStatus are not directly saved in db
        em.detach(updatedTimesheetStatus);
        updatedTimesheetStatus.statusName(UPDATED_STATUS_NAME);

        restTimesheetStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTimesheetStatus.getTimesheetStatusId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTimesheetStatus))
            )
            .andExpect(status().isOk());

        // Validate the TimesheetStatus in the database
        List<TimesheetStatus> timesheetStatusList = timesheetStatusRepository.findAll();
        assertThat(timesheetStatusList).hasSize(databaseSizeBeforeUpdate);
        TimesheetStatus testTimesheetStatus = timesheetStatusList.get(timesheetStatusList.size() - 1);
        assertThat(testTimesheetStatus.getStatusName()).isEqualTo(UPDATED_STATUS_NAME);
    }

    @Test
    @Transactional
    void putNonExistingTimesheetStatus() throws Exception {
        int databaseSizeBeforeUpdate = timesheetStatusRepository.findAll().size();
        timesheetStatus.setTimesheetStatusId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimesheetStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, timesheetStatus.getTimesheetStatusId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timesheetStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimesheetStatus in the database
        List<TimesheetStatus> timesheetStatusList = timesheetStatusRepository.findAll();
        assertThat(timesheetStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTimesheetStatus() throws Exception {
        int databaseSizeBeforeUpdate = timesheetStatusRepository.findAll().size();
        timesheetStatus.setTimesheetStatusId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimesheetStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timesheetStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimesheetStatus in the database
        List<TimesheetStatus> timesheetStatusList = timesheetStatusRepository.findAll();
        assertThat(timesheetStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTimesheetStatus() throws Exception {
        int databaseSizeBeforeUpdate = timesheetStatusRepository.findAll().size();
        timesheetStatus.setTimesheetStatusId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimesheetStatusMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timesheetStatus))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TimesheetStatus in the database
        List<TimesheetStatus> timesheetStatusList = timesheetStatusRepository.findAll();
        assertThat(timesheetStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTimesheetStatusWithPatch() throws Exception {
        // Initialize the database
        timesheetStatusRepository.saveAndFlush(timesheetStatus);

        int databaseSizeBeforeUpdate = timesheetStatusRepository.findAll().size();

        // Update the timesheetStatus using partial update
        TimesheetStatus partialUpdatedTimesheetStatus = new TimesheetStatus();
        partialUpdatedTimesheetStatus.setTimesheetStatusId(timesheetStatus.getTimesheetStatusId());

        partialUpdatedTimesheetStatus.statusName(UPDATED_STATUS_NAME);

        restTimesheetStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTimesheetStatus.getTimesheetStatusId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTimesheetStatus))
            )
            .andExpect(status().isOk());

        // Validate the TimesheetStatus in the database
        List<TimesheetStatus> timesheetStatusList = timesheetStatusRepository.findAll();
        assertThat(timesheetStatusList).hasSize(databaseSizeBeforeUpdate);
        TimesheetStatus testTimesheetStatus = timesheetStatusList.get(timesheetStatusList.size() - 1);
        assertThat(testTimesheetStatus.getStatusName()).isEqualTo(UPDATED_STATUS_NAME);
    }

    @Test
    @Transactional
    void fullUpdateTimesheetStatusWithPatch() throws Exception {
        // Initialize the database
        timesheetStatusRepository.saveAndFlush(timesheetStatus);

        int databaseSizeBeforeUpdate = timesheetStatusRepository.findAll().size();

        // Update the timesheetStatus using partial update
        TimesheetStatus partialUpdatedTimesheetStatus = new TimesheetStatus();
        partialUpdatedTimesheetStatus.setTimesheetStatusId(timesheetStatus.getTimesheetStatusId());

        partialUpdatedTimesheetStatus.statusName(UPDATED_STATUS_NAME);

        restTimesheetStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTimesheetStatus.getTimesheetStatusId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTimesheetStatus))
            )
            .andExpect(status().isOk());

        // Validate the TimesheetStatus in the database
        List<TimesheetStatus> timesheetStatusList = timesheetStatusRepository.findAll();
        assertThat(timesheetStatusList).hasSize(databaseSizeBeforeUpdate);
        TimesheetStatus testTimesheetStatus = timesheetStatusList.get(timesheetStatusList.size() - 1);
        assertThat(testTimesheetStatus.getStatusName()).isEqualTo(UPDATED_STATUS_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingTimesheetStatus() throws Exception {
        int databaseSizeBeforeUpdate = timesheetStatusRepository.findAll().size();
        timesheetStatus.setTimesheetStatusId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimesheetStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, timesheetStatus.getTimesheetStatusId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timesheetStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimesheetStatus in the database
        List<TimesheetStatus> timesheetStatusList = timesheetStatusRepository.findAll();
        assertThat(timesheetStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTimesheetStatus() throws Exception {
        int databaseSizeBeforeUpdate = timesheetStatusRepository.findAll().size();
        timesheetStatus.setTimesheetStatusId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimesheetStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timesheetStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimesheetStatus in the database
        List<TimesheetStatus> timesheetStatusList = timesheetStatusRepository.findAll();
        assertThat(timesheetStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTimesheetStatus() throws Exception {
        int databaseSizeBeforeUpdate = timesheetStatusRepository.findAll().size();
        timesheetStatus.setTimesheetStatusId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimesheetStatusMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timesheetStatus))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TimesheetStatus in the database
        List<TimesheetStatus> timesheetStatusList = timesheetStatusRepository.findAll();
        assertThat(timesheetStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTimesheetStatus() throws Exception {
        // Initialize the database
        timesheetStatusRepository.saveAndFlush(timesheetStatus);

        int databaseSizeBeforeDelete = timesheetStatusRepository.findAll().size();

        // Delete the timesheetStatus
        restTimesheetStatusMockMvc
            .perform(delete(ENTITY_API_URL_ID, timesheetStatus.getTimesheetStatusId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TimesheetStatus> timesheetStatusList = timesheetStatusRepository.findAll();
        assertThat(timesheetStatusList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
