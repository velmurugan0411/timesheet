package com.techfinite.timesheet.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.techfinite.timesheet.IntegrationTest;
import com.techfinite.timesheet.domain.Task;
import com.techfinite.timesheet.domain.TimeoffType;
import com.techfinite.timesheet.domain.Timesheet;
import com.techfinite.timesheet.domain.TimesheetDetails;
import com.techfinite.timesheet.repository.TimesheetDetailsRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link TimesheetDetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TimesheetDetailsResourceIT {

    private static final Instant DEFAULT_WORKDATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_WORKDATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Integer DEFAULT_HOURS = 1;
    private static final Integer UPDATED_HOURS = 2;

    private static final String ENTITY_API_URL = "/api/timesheet-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{timesheetDetailsId}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TimesheetDetailsRepository timesheetDetailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTimesheetDetailsMockMvc;

    private TimesheetDetails timesheetDetails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TimesheetDetails createEntity(EntityManager em) {
        TimesheetDetails timesheetDetails = new TimesheetDetails().workdate(DEFAULT_WORKDATE).hours(DEFAULT_HOURS);
        // Add required entity
        TimeoffType timeoffType;
        if (TestUtil.findAll(em, TimeoffType.class).isEmpty()) {
            timeoffType = TimeoffTypeResourceIT.createEntity(em);
            em.persist(timeoffType);
            em.flush();
        } else {
            timeoffType = TestUtil.findAll(em, TimeoffType.class).get(0);
        }
        timesheetDetails.setTimeoffTypeId(timeoffType);
        // Add required entity
        Task task;
        if (TestUtil.findAll(em, Task.class).isEmpty()) {
            task = TaskResourceIT.createEntity(em);
            em.persist(task);
            em.flush();
        } else {
            task = TestUtil.findAll(em, Task.class).get(0);
        }
        timesheetDetails.setTaskId(task);
        // Add required entity
        Timesheet timesheet;
        if (TestUtil.findAll(em, Timesheet.class).isEmpty()) {
            timesheet = TimesheetResourceIT.createEntity(em);
            em.persist(timesheet);
            em.flush();
        } else {
            timesheet = TestUtil.findAll(em, Timesheet.class).get(0);
        }
        timesheetDetails.setTimesheetId(timesheet);
        return timesheetDetails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TimesheetDetails createUpdatedEntity(EntityManager em) {
        TimesheetDetails timesheetDetails = new TimesheetDetails().workdate(UPDATED_WORKDATE).hours(UPDATED_HOURS);
        // Add required entity
        TimeoffType timeoffType;
        if (TestUtil.findAll(em, TimeoffType.class).isEmpty()) {
            timeoffType = TimeoffTypeResourceIT.createUpdatedEntity(em);
            em.persist(timeoffType);
            em.flush();
        } else {
            timeoffType = TestUtil.findAll(em, TimeoffType.class).get(0);
        }
        timesheetDetails.setTimeoffTypeId(timeoffType);
        // Add required entity
        Task task;
        if (TestUtil.findAll(em, Task.class).isEmpty()) {
            task = TaskResourceIT.createUpdatedEntity(em);
            em.persist(task);
            em.flush();
        } else {
            task = TestUtil.findAll(em, Task.class).get(0);
        }
        timesheetDetails.setTaskId(task);
        // Add required entity
        Timesheet timesheet;
        if (TestUtil.findAll(em, Timesheet.class).isEmpty()) {
            timesheet = TimesheetResourceIT.createUpdatedEntity(em);
            em.persist(timesheet);
            em.flush();
        } else {
            timesheet = TestUtil.findAll(em, Timesheet.class).get(0);
        }
        timesheetDetails.setTimesheetId(timesheet);
        return timesheetDetails;
    }

    @BeforeEach
    public void initTest() {
        timesheetDetails = createEntity(em);
    }

    @Test
    @Transactional
    void createTimesheetDetails() throws Exception {
        int databaseSizeBeforeCreate = timesheetDetailsRepository.findAll().size();
        // Create the TimesheetDetails
        restTimesheetDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timesheetDetails))
            )
            .andExpect(status().isCreated());

        // Validate the TimesheetDetails in the database
        List<TimesheetDetails> timesheetDetailsList = timesheetDetailsRepository.findAll();
        assertThat(timesheetDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        TimesheetDetails testTimesheetDetails = timesheetDetailsList.get(timesheetDetailsList.size() - 1);
        assertThat(testTimesheetDetails.getWorkdate()).isEqualTo(DEFAULT_WORKDATE);
        assertThat(testTimesheetDetails.getHours()).isEqualTo(DEFAULT_HOURS);
    }

    @Test
    @Transactional
    void createTimesheetDetailsWithExistingId() throws Exception {
        // Create the TimesheetDetails with an existing ID
        timesheetDetails.setTimesheetDetailsId(1L);

        int databaseSizeBeforeCreate = timesheetDetailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTimesheetDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timesheetDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimesheetDetails in the database
        List<TimesheetDetails> timesheetDetailsList = timesheetDetailsRepository.findAll();
        assertThat(timesheetDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkWorkdateIsRequired() throws Exception {
        int databaseSizeBeforeTest = timesheetDetailsRepository.findAll().size();
        // set the field null
        timesheetDetails.setWorkdate(null);

        // Create the TimesheetDetails, which fails.

        restTimesheetDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timesheetDetails))
            )
            .andExpect(status().isBadRequest());

        List<TimesheetDetails> timesheetDetailsList = timesheetDetailsRepository.findAll();
        assertThat(timesheetDetailsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkHoursIsRequired() throws Exception {
        int databaseSizeBeforeTest = timesheetDetailsRepository.findAll().size();
        // set the field null
        timesheetDetails.setHours(null);

        // Create the TimesheetDetails, which fails.

        restTimesheetDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timesheetDetails))
            )
            .andExpect(status().isBadRequest());

        List<TimesheetDetails> timesheetDetailsList = timesheetDetailsRepository.findAll();
        assertThat(timesheetDetailsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTimesheetDetails() throws Exception {
        // Initialize the database
        timesheetDetailsRepository.saveAndFlush(timesheetDetails);

        // Get all the timesheetDetailsList
        restTimesheetDetailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=timesheetDetailsId,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].timesheetDetailsId").value(hasItem(timesheetDetails.getTimesheetDetailsId().intValue())))
            .andExpect(jsonPath("$.[*].workdate").value(hasItem(DEFAULT_WORKDATE.toString())))
            .andExpect(jsonPath("$.[*].hours").value(hasItem(DEFAULT_HOURS)));
    }

    @Test
    @Transactional
    void getTimesheetDetails() throws Exception {
        // Initialize the database
        timesheetDetailsRepository.saveAndFlush(timesheetDetails);

        // Get the timesheetDetails
        restTimesheetDetailsMockMvc
            .perform(get(ENTITY_API_URL_ID, timesheetDetails.getTimesheetDetailsId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.timesheetDetailsId").value(timesheetDetails.getTimesheetDetailsId().intValue()))
            .andExpect(jsonPath("$.workdate").value(DEFAULT_WORKDATE.toString()))
            .andExpect(jsonPath("$.hours").value(DEFAULT_HOURS));
    }

    @Test
    @Transactional
    void getNonExistingTimesheetDetails() throws Exception {
        // Get the timesheetDetails
        restTimesheetDetailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTimesheetDetails() throws Exception {
        // Initialize the database
        timesheetDetailsRepository.saveAndFlush(timesheetDetails);

        int databaseSizeBeforeUpdate = timesheetDetailsRepository.findAll().size();

        // Update the timesheetDetails
        TimesheetDetails updatedTimesheetDetails = timesheetDetailsRepository.findById(timesheetDetails.getTimesheetDetailsId()).get();
        // Disconnect from session so that the updates on updatedTimesheetDetails are not directly saved in db
        em.detach(updatedTimesheetDetails);
        updatedTimesheetDetails.workdate(UPDATED_WORKDATE).hours(UPDATED_HOURS);

        restTimesheetDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTimesheetDetails.getTimesheetDetailsId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTimesheetDetails))
            )
            .andExpect(status().isOk());

        // Validate the TimesheetDetails in the database
        List<TimesheetDetails> timesheetDetailsList = timesheetDetailsRepository.findAll();
        assertThat(timesheetDetailsList).hasSize(databaseSizeBeforeUpdate);
        TimesheetDetails testTimesheetDetails = timesheetDetailsList.get(timesheetDetailsList.size() - 1);
        assertThat(testTimesheetDetails.getWorkdate()).isEqualTo(UPDATED_WORKDATE);
        assertThat(testTimesheetDetails.getHours()).isEqualTo(UPDATED_HOURS);
    }

    @Test
    @Transactional
    void putNonExistingTimesheetDetails() throws Exception {
        int databaseSizeBeforeUpdate = timesheetDetailsRepository.findAll().size();
        timesheetDetails.setTimesheetDetailsId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimesheetDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, timesheetDetails.getTimesheetDetailsId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timesheetDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimesheetDetails in the database
        List<TimesheetDetails> timesheetDetailsList = timesheetDetailsRepository.findAll();
        assertThat(timesheetDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTimesheetDetails() throws Exception {
        int databaseSizeBeforeUpdate = timesheetDetailsRepository.findAll().size();
        timesheetDetails.setTimesheetDetailsId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimesheetDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timesheetDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimesheetDetails in the database
        List<TimesheetDetails> timesheetDetailsList = timesheetDetailsRepository.findAll();
        assertThat(timesheetDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTimesheetDetails() throws Exception {
        int databaseSizeBeforeUpdate = timesheetDetailsRepository.findAll().size();
        timesheetDetails.setTimesheetDetailsId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimesheetDetailsMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timesheetDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TimesheetDetails in the database
        List<TimesheetDetails> timesheetDetailsList = timesheetDetailsRepository.findAll();
        assertThat(timesheetDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTimesheetDetailsWithPatch() throws Exception {
        // Initialize the database
        timesheetDetailsRepository.saveAndFlush(timesheetDetails);

        int databaseSizeBeforeUpdate = timesheetDetailsRepository.findAll().size();

        // Update the timesheetDetails using partial update
        TimesheetDetails partialUpdatedTimesheetDetails = new TimesheetDetails();
        partialUpdatedTimesheetDetails.setTimesheetDetailsId(timesheetDetails.getTimesheetDetailsId());

        partialUpdatedTimesheetDetails.workdate(UPDATED_WORKDATE).hours(UPDATED_HOURS);

        restTimesheetDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTimesheetDetails.getTimesheetDetailsId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTimesheetDetails))
            )
            .andExpect(status().isOk());

        // Validate the TimesheetDetails in the database
        List<TimesheetDetails> timesheetDetailsList = timesheetDetailsRepository.findAll();
        assertThat(timesheetDetailsList).hasSize(databaseSizeBeforeUpdate);
        TimesheetDetails testTimesheetDetails = timesheetDetailsList.get(timesheetDetailsList.size() - 1);
        assertThat(testTimesheetDetails.getWorkdate()).isEqualTo(UPDATED_WORKDATE);
        assertThat(testTimesheetDetails.getHours()).isEqualTo(UPDATED_HOURS);
    }

    @Test
    @Transactional
    void fullUpdateTimesheetDetailsWithPatch() throws Exception {
        // Initialize the database
        timesheetDetailsRepository.saveAndFlush(timesheetDetails);

        int databaseSizeBeforeUpdate = timesheetDetailsRepository.findAll().size();

        // Update the timesheetDetails using partial update
        TimesheetDetails partialUpdatedTimesheetDetails = new TimesheetDetails();
        partialUpdatedTimesheetDetails.setTimesheetDetailsId(timesheetDetails.getTimesheetDetailsId());

        partialUpdatedTimesheetDetails.workdate(UPDATED_WORKDATE).hours(UPDATED_HOURS);

        restTimesheetDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTimesheetDetails.getTimesheetDetailsId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTimesheetDetails))
            )
            .andExpect(status().isOk());

        // Validate the TimesheetDetails in the database
        List<TimesheetDetails> timesheetDetailsList = timesheetDetailsRepository.findAll();
        assertThat(timesheetDetailsList).hasSize(databaseSizeBeforeUpdate);
        TimesheetDetails testTimesheetDetails = timesheetDetailsList.get(timesheetDetailsList.size() - 1);
        assertThat(testTimesheetDetails.getWorkdate()).isEqualTo(UPDATED_WORKDATE);
        assertThat(testTimesheetDetails.getHours()).isEqualTo(UPDATED_HOURS);
    }

    @Test
    @Transactional
    void patchNonExistingTimesheetDetails() throws Exception {
        int databaseSizeBeforeUpdate = timesheetDetailsRepository.findAll().size();
        timesheetDetails.setTimesheetDetailsId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimesheetDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, timesheetDetails.getTimesheetDetailsId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timesheetDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimesheetDetails in the database
        List<TimesheetDetails> timesheetDetailsList = timesheetDetailsRepository.findAll();
        assertThat(timesheetDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTimesheetDetails() throws Exception {
        int databaseSizeBeforeUpdate = timesheetDetailsRepository.findAll().size();
        timesheetDetails.setTimesheetDetailsId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimesheetDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timesheetDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimesheetDetails in the database
        List<TimesheetDetails> timesheetDetailsList = timesheetDetailsRepository.findAll();
        assertThat(timesheetDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTimesheetDetails() throws Exception {
        int databaseSizeBeforeUpdate = timesheetDetailsRepository.findAll().size();
        timesheetDetails.setTimesheetDetailsId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimesheetDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timesheetDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TimesheetDetails in the database
        List<TimesheetDetails> timesheetDetailsList = timesheetDetailsRepository.findAll();
        assertThat(timesheetDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTimesheetDetails() throws Exception {
        // Initialize the database
        timesheetDetailsRepository.saveAndFlush(timesheetDetails);

        int databaseSizeBeforeDelete = timesheetDetailsRepository.findAll().size();

        // Delete the timesheetDetails
        restTimesheetDetailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, timesheetDetails.getTimesheetDetailsId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TimesheetDetails> timesheetDetailsList = timesheetDetailsRepository.findAll();
        assertThat(timesheetDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
