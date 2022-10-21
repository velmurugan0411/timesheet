package com.techfinite.timesheet.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.techfinite.timesheet.IntegrationTest;
import com.techfinite.timesheet.domain.Timesheet;
import com.techfinite.timesheet.repository.TimesheetRepository;
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
 * Integration tests for the {@link TimesheetResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TimesheetResourceIT {

    private static final Long DEFAULT_USER_ID = 1L;
    private static final Long UPDATED_USER_ID = 2L;

    private static final Long DEFAULT_TIMESHEET_STATUS_ID = 1L;
    private static final Long UPDATED_TIMESHEET_STATUS_ID = 2L;

    private static final Instant DEFAULT_PERIOD_STARTING_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_PERIOD_STARTING_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_PERIOD_ENDING_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_PERIOD_ENDING_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_NOTES = "AAAAAAAAAA";
    private static final String UPDATED_NOTES = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/timesheets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{timesheetId}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TimesheetRepository timesheetRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTimesheetMockMvc;

    private Timesheet timesheet;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Timesheet createEntity(EntityManager em) {
        Timesheet timesheet = new Timesheet()
            .userId(DEFAULT_USER_ID)
            .timesheetStatusId(DEFAULT_TIMESHEET_STATUS_ID)
            .periodStartingDate(DEFAULT_PERIOD_STARTING_DATE)
            .periodEndingDate(DEFAULT_PERIOD_ENDING_DATE)
            .notes(DEFAULT_NOTES);
        return timesheet;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Timesheet createUpdatedEntity(EntityManager em) {
        Timesheet timesheet = new Timesheet()
            .userId(UPDATED_USER_ID)
            .timesheetStatusId(UPDATED_TIMESHEET_STATUS_ID)
            .periodStartingDate(UPDATED_PERIOD_STARTING_DATE)
            .periodEndingDate(UPDATED_PERIOD_ENDING_DATE)
            .notes(UPDATED_NOTES);
        return timesheet;
    }

    @BeforeEach
    public void initTest() {
        timesheet = createEntity(em);
    }

    @Test
    @Transactional
    void createTimesheet() throws Exception {
        int databaseSizeBeforeCreate = timesheetRepository.findAll().size();
        // Create the Timesheet
        restTimesheetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timesheet)))
            .andExpect(status().isCreated());

        // Validate the Timesheet in the database
        List<Timesheet> timesheetList = timesheetRepository.findAll();
        assertThat(timesheetList).hasSize(databaseSizeBeforeCreate + 1);
        Timesheet testTimesheet = timesheetList.get(timesheetList.size() - 1);
        assertThat(testTimesheet.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testTimesheet.getTimesheetStatusId()).isEqualTo(DEFAULT_TIMESHEET_STATUS_ID);
        assertThat(testTimesheet.getPeriodStartingDate()).isEqualTo(DEFAULT_PERIOD_STARTING_DATE);
        assertThat(testTimesheet.getPeriodEndingDate()).isEqualTo(DEFAULT_PERIOD_ENDING_DATE);
        assertThat(testTimesheet.getNotes()).isEqualTo(DEFAULT_NOTES);
    }

    @Test
    @Transactional
    void createTimesheetWithExistingId() throws Exception {
        // Create the Timesheet with an existing ID
        timesheet.setTimesheetId(1L);

        int databaseSizeBeforeCreate = timesheetRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTimesheetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timesheet)))
            .andExpect(status().isBadRequest());

        // Validate the Timesheet in the database
        List<Timesheet> timesheetList = timesheetRepository.findAll();
        assertThat(timesheetList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkUserIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = timesheetRepository.findAll().size();
        // set the field null
        timesheet.setUserId(null);

        // Create the Timesheet, which fails.

        restTimesheetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timesheet)))
            .andExpect(status().isBadRequest());

        List<Timesheet> timesheetList = timesheetRepository.findAll();
        assertThat(timesheetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTimesheetStatusIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = timesheetRepository.findAll().size();
        // set the field null
        timesheet.setTimesheetStatusId(null);

        // Create the Timesheet, which fails.

        restTimesheetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timesheet)))
            .andExpect(status().isBadRequest());

        List<Timesheet> timesheetList = timesheetRepository.findAll();
        assertThat(timesheetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPeriodStartingDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = timesheetRepository.findAll().size();
        // set the field null
        timesheet.setPeriodStartingDate(null);

        // Create the Timesheet, which fails.

        restTimesheetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timesheet)))
            .andExpect(status().isBadRequest());

        List<Timesheet> timesheetList = timesheetRepository.findAll();
        assertThat(timesheetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPeriodEndingDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = timesheetRepository.findAll().size();
        // set the field null
        timesheet.setPeriodEndingDate(null);

        // Create the Timesheet, which fails.

        restTimesheetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timesheet)))
            .andExpect(status().isBadRequest());

        List<Timesheet> timesheetList = timesheetRepository.findAll();
        assertThat(timesheetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTimesheets() throws Exception {
        // Initialize the database
        timesheetRepository.saveAndFlush(timesheet);

        // Get all the timesheetList
        restTimesheetMockMvc
            .perform(get(ENTITY_API_URL + "?sort=timesheetId,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].timesheetId").value(hasItem(timesheet.getTimesheetId().intValue())))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID.intValue())))
            .andExpect(jsonPath("$.[*].timesheetStatusId").value(hasItem(DEFAULT_TIMESHEET_STATUS_ID.intValue())))
            .andExpect(jsonPath("$.[*].periodStartingDate").value(hasItem(DEFAULT_PERIOD_STARTING_DATE.toString())))
            .andExpect(jsonPath("$.[*].periodEndingDate").value(hasItem(DEFAULT_PERIOD_ENDING_DATE.toString())))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES)));
    }

    @Test
    @Transactional
    void getTimesheet() throws Exception {
        // Initialize the database
        timesheetRepository.saveAndFlush(timesheet);

        // Get the timesheet
        restTimesheetMockMvc
            .perform(get(ENTITY_API_URL_ID, timesheet.getTimesheetId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.timesheetId").value(timesheet.getTimesheetId().intValue()))
            .andExpect(jsonPath("$.userId").value(DEFAULT_USER_ID.intValue()))
            .andExpect(jsonPath("$.timesheetStatusId").value(DEFAULT_TIMESHEET_STATUS_ID.intValue()))
            .andExpect(jsonPath("$.periodStartingDate").value(DEFAULT_PERIOD_STARTING_DATE.toString()))
            .andExpect(jsonPath("$.periodEndingDate").value(DEFAULT_PERIOD_ENDING_DATE.toString()))
            .andExpect(jsonPath("$.notes").value(DEFAULT_NOTES));
    }

    @Test
    @Transactional
    void getNonExistingTimesheet() throws Exception {
        // Get the timesheet
        restTimesheetMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTimesheet() throws Exception {
        // Initialize the database
        timesheetRepository.saveAndFlush(timesheet);

        int databaseSizeBeforeUpdate = timesheetRepository.findAll().size();

        // Update the timesheet
        Timesheet updatedTimesheet = timesheetRepository.findById(timesheet.getTimesheetId()).get();
        // Disconnect from session so that the updates on updatedTimesheet are not directly saved in db
        em.detach(updatedTimesheet);
        updatedTimesheet
            .userId(UPDATED_USER_ID)
            .timesheetStatusId(UPDATED_TIMESHEET_STATUS_ID)
            .periodStartingDate(UPDATED_PERIOD_STARTING_DATE)
            .periodEndingDate(UPDATED_PERIOD_ENDING_DATE)
            .notes(UPDATED_NOTES);

        restTimesheetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTimesheet.getTimesheetId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTimesheet))
            )
            .andExpect(status().isOk());

        // Validate the Timesheet in the database
        List<Timesheet> timesheetList = timesheetRepository.findAll();
        assertThat(timesheetList).hasSize(databaseSizeBeforeUpdate);
        Timesheet testTimesheet = timesheetList.get(timesheetList.size() - 1);
        assertThat(testTimesheet.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testTimesheet.getTimesheetStatusId()).isEqualTo(UPDATED_TIMESHEET_STATUS_ID);
        assertThat(testTimesheet.getPeriodStartingDate()).isEqualTo(UPDATED_PERIOD_STARTING_DATE);
        assertThat(testTimesheet.getPeriodEndingDate()).isEqualTo(UPDATED_PERIOD_ENDING_DATE);
        assertThat(testTimesheet.getNotes()).isEqualTo(UPDATED_NOTES);
    }

    @Test
    @Transactional
    void putNonExistingTimesheet() throws Exception {
        int databaseSizeBeforeUpdate = timesheetRepository.findAll().size();
        timesheet.setTimesheetId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimesheetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, timesheet.getTimesheetId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timesheet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Timesheet in the database
        List<Timesheet> timesheetList = timesheetRepository.findAll();
        assertThat(timesheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTimesheet() throws Exception {
        int databaseSizeBeforeUpdate = timesheetRepository.findAll().size();
        timesheet.setTimesheetId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimesheetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timesheet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Timesheet in the database
        List<Timesheet> timesheetList = timesheetRepository.findAll();
        assertThat(timesheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTimesheet() throws Exception {
        int databaseSizeBeforeUpdate = timesheetRepository.findAll().size();
        timesheet.setTimesheetId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimesheetMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timesheet)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Timesheet in the database
        List<Timesheet> timesheetList = timesheetRepository.findAll();
        assertThat(timesheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTimesheetWithPatch() throws Exception {
        // Initialize the database
        timesheetRepository.saveAndFlush(timesheet);

        int databaseSizeBeforeUpdate = timesheetRepository.findAll().size();

        // Update the timesheet using partial update
        Timesheet partialUpdatedTimesheet = new Timesheet();
        partialUpdatedTimesheet.setTimesheetId(timesheet.getTimesheetId());

        partialUpdatedTimesheet
            .userId(UPDATED_USER_ID)
            .timesheetStatusId(UPDATED_TIMESHEET_STATUS_ID)
            .periodEndingDate(UPDATED_PERIOD_ENDING_DATE);

        restTimesheetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTimesheet.getTimesheetId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTimesheet))
            )
            .andExpect(status().isOk());

        // Validate the Timesheet in the database
        List<Timesheet> timesheetList = timesheetRepository.findAll();
        assertThat(timesheetList).hasSize(databaseSizeBeforeUpdate);
        Timesheet testTimesheet = timesheetList.get(timesheetList.size() - 1);
        assertThat(testTimesheet.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testTimesheet.getTimesheetStatusId()).isEqualTo(UPDATED_TIMESHEET_STATUS_ID);
        assertThat(testTimesheet.getPeriodStartingDate()).isEqualTo(DEFAULT_PERIOD_STARTING_DATE);
        assertThat(testTimesheet.getPeriodEndingDate()).isEqualTo(UPDATED_PERIOD_ENDING_DATE);
        assertThat(testTimesheet.getNotes()).isEqualTo(DEFAULT_NOTES);
    }

    @Test
    @Transactional
    void fullUpdateTimesheetWithPatch() throws Exception {
        // Initialize the database
        timesheetRepository.saveAndFlush(timesheet);

        int databaseSizeBeforeUpdate = timesheetRepository.findAll().size();

        // Update the timesheet using partial update
        Timesheet partialUpdatedTimesheet = new Timesheet();
        partialUpdatedTimesheet.setTimesheetId(timesheet.getTimesheetId());

        partialUpdatedTimesheet
            .userId(UPDATED_USER_ID)
            .timesheetStatusId(UPDATED_TIMESHEET_STATUS_ID)
            .periodStartingDate(UPDATED_PERIOD_STARTING_DATE)
            .periodEndingDate(UPDATED_PERIOD_ENDING_DATE)
            .notes(UPDATED_NOTES);

        restTimesheetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTimesheet.getTimesheetId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTimesheet))
            )
            .andExpect(status().isOk());

        // Validate the Timesheet in the database
        List<Timesheet> timesheetList = timesheetRepository.findAll();
        assertThat(timesheetList).hasSize(databaseSizeBeforeUpdate);
        Timesheet testTimesheet = timesheetList.get(timesheetList.size() - 1);
        assertThat(testTimesheet.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testTimesheet.getTimesheetStatusId()).isEqualTo(UPDATED_TIMESHEET_STATUS_ID);
        assertThat(testTimesheet.getPeriodStartingDate()).isEqualTo(UPDATED_PERIOD_STARTING_DATE);
        assertThat(testTimesheet.getPeriodEndingDate()).isEqualTo(UPDATED_PERIOD_ENDING_DATE);
        assertThat(testTimesheet.getNotes()).isEqualTo(UPDATED_NOTES);
    }

    @Test
    @Transactional
    void patchNonExistingTimesheet() throws Exception {
        int databaseSizeBeforeUpdate = timesheetRepository.findAll().size();
        timesheet.setTimesheetId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimesheetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, timesheet.getTimesheetId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timesheet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Timesheet in the database
        List<Timesheet> timesheetList = timesheetRepository.findAll();
        assertThat(timesheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTimesheet() throws Exception {
        int databaseSizeBeforeUpdate = timesheetRepository.findAll().size();
        timesheet.setTimesheetId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimesheetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timesheet))
            )
            .andExpect(status().isBadRequest());

        // Validate the Timesheet in the database
        List<Timesheet> timesheetList = timesheetRepository.findAll();
        assertThat(timesheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTimesheet() throws Exception {
        int databaseSizeBeforeUpdate = timesheetRepository.findAll().size();
        timesheet.setTimesheetId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimesheetMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(timesheet))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Timesheet in the database
        List<Timesheet> timesheetList = timesheetRepository.findAll();
        assertThat(timesheetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTimesheet() throws Exception {
        // Initialize the database
        timesheetRepository.saveAndFlush(timesheet);

        int databaseSizeBeforeDelete = timesheetRepository.findAll().size();

        // Delete the timesheet
        restTimesheetMockMvc
            .perform(delete(ENTITY_API_URL_ID, timesheet.getTimesheetId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Timesheet> timesheetList = timesheetRepository.findAll();
        assertThat(timesheetList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
