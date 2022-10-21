package com.techfinite.timesheet.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.techfinite.timesheet.IntegrationTest;
import com.techfinite.timesheet.domain.TimeoffType;
import com.techfinite.timesheet.repository.TimeoffTypeRepository;
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
 * Integration tests for the {@link TimeoffTypeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TimeoffTypeResourceIT {

    private static final String DEFAULT_TYPE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_TYPE_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/timeoff-types";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{timeoffTypeId}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TimeoffTypeRepository timeoffTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTimeoffTypeMockMvc;

    private TimeoffType timeoffType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TimeoffType createEntity(EntityManager em) {
        TimeoffType timeoffType = new TimeoffType().typeName(DEFAULT_TYPE_NAME);
        return timeoffType;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TimeoffType createUpdatedEntity(EntityManager em) {
        TimeoffType timeoffType = new TimeoffType().typeName(UPDATED_TYPE_NAME);
        return timeoffType;
    }

    @BeforeEach
    public void initTest() {
        timeoffType = createEntity(em);
    }

    @Test
    @Transactional
    void createTimeoffType() throws Exception {
        int databaseSizeBeforeCreate = timeoffTypeRepository.findAll().size();
        // Create the TimeoffType
        restTimeoffTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timeoffType)))
            .andExpect(status().isCreated());

        // Validate the TimeoffType in the database
        List<TimeoffType> timeoffTypeList = timeoffTypeRepository.findAll();
        assertThat(timeoffTypeList).hasSize(databaseSizeBeforeCreate + 1);
        TimeoffType testTimeoffType = timeoffTypeList.get(timeoffTypeList.size() - 1);
        assertThat(testTimeoffType.getTypeName()).isEqualTo(DEFAULT_TYPE_NAME);
    }

    @Test
    @Transactional
    void createTimeoffTypeWithExistingId() throws Exception {
        // Create the TimeoffType with an existing ID
        timeoffType.setTimeoffTypeId(1L);

        int databaseSizeBeforeCreate = timeoffTypeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTimeoffTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timeoffType)))
            .andExpect(status().isBadRequest());

        // Validate the TimeoffType in the database
        List<TimeoffType> timeoffTypeList = timeoffTypeRepository.findAll();
        assertThat(timeoffTypeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTimeoffTypes() throws Exception {
        // Initialize the database
        timeoffTypeRepository.saveAndFlush(timeoffType);

        // Get all the timeoffTypeList
        restTimeoffTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=timeoffTypeId,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].timeoffTypeId").value(hasItem(timeoffType.getTimeoffTypeId().intValue())))
            .andExpect(jsonPath("$.[*].typeName").value(hasItem(DEFAULT_TYPE_NAME)));
    }

    @Test
    @Transactional
    void getTimeoffType() throws Exception {
        // Initialize the database
        timeoffTypeRepository.saveAndFlush(timeoffType);

        // Get the timeoffType
        restTimeoffTypeMockMvc
            .perform(get(ENTITY_API_URL_ID, timeoffType.getTimeoffTypeId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.timeoffTypeId").value(timeoffType.getTimeoffTypeId().intValue()))
            .andExpect(jsonPath("$.typeName").value(DEFAULT_TYPE_NAME));
    }

    @Test
    @Transactional
    void getNonExistingTimeoffType() throws Exception {
        // Get the timeoffType
        restTimeoffTypeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTimeoffType() throws Exception {
        // Initialize the database
        timeoffTypeRepository.saveAndFlush(timeoffType);

        int databaseSizeBeforeUpdate = timeoffTypeRepository.findAll().size();

        // Update the timeoffType
        TimeoffType updatedTimeoffType = timeoffTypeRepository.findById(timeoffType.getTimeoffTypeId()).get();
        // Disconnect from session so that the updates on updatedTimeoffType are not directly saved in db
        em.detach(updatedTimeoffType);
        updatedTimeoffType.typeName(UPDATED_TYPE_NAME);

        restTimeoffTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTimeoffType.getTimeoffTypeId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTimeoffType))
            )
            .andExpect(status().isOk());

        // Validate the TimeoffType in the database
        List<TimeoffType> timeoffTypeList = timeoffTypeRepository.findAll();
        assertThat(timeoffTypeList).hasSize(databaseSizeBeforeUpdate);
        TimeoffType testTimeoffType = timeoffTypeList.get(timeoffTypeList.size() - 1);
        assertThat(testTimeoffType.getTypeName()).isEqualTo(UPDATED_TYPE_NAME);
    }

    @Test
    @Transactional
    void putNonExistingTimeoffType() throws Exception {
        int databaseSizeBeforeUpdate = timeoffTypeRepository.findAll().size();
        timeoffType.setTimeoffTypeId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimeoffTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, timeoffType.getTimeoffTypeId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timeoffType))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimeoffType in the database
        List<TimeoffType> timeoffTypeList = timeoffTypeRepository.findAll();
        assertThat(timeoffTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTimeoffType() throws Exception {
        int databaseSizeBeforeUpdate = timeoffTypeRepository.findAll().size();
        timeoffType.setTimeoffTypeId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeoffTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(timeoffType))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimeoffType in the database
        List<TimeoffType> timeoffTypeList = timeoffTypeRepository.findAll();
        assertThat(timeoffTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTimeoffType() throws Exception {
        int databaseSizeBeforeUpdate = timeoffTypeRepository.findAll().size();
        timeoffType.setTimeoffTypeId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeoffTypeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(timeoffType)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TimeoffType in the database
        List<TimeoffType> timeoffTypeList = timeoffTypeRepository.findAll();
        assertThat(timeoffTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTimeoffTypeWithPatch() throws Exception {
        // Initialize the database
        timeoffTypeRepository.saveAndFlush(timeoffType);

        int databaseSizeBeforeUpdate = timeoffTypeRepository.findAll().size();

        // Update the timeoffType using partial update
        TimeoffType partialUpdatedTimeoffType = new TimeoffType();
        partialUpdatedTimeoffType.setTimeoffTypeId(timeoffType.getTimeoffTypeId());

        partialUpdatedTimeoffType.typeName(UPDATED_TYPE_NAME);

        restTimeoffTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTimeoffType.getTimeoffTypeId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTimeoffType))
            )
            .andExpect(status().isOk());

        // Validate the TimeoffType in the database
        List<TimeoffType> timeoffTypeList = timeoffTypeRepository.findAll();
        assertThat(timeoffTypeList).hasSize(databaseSizeBeforeUpdate);
        TimeoffType testTimeoffType = timeoffTypeList.get(timeoffTypeList.size() - 1);
        assertThat(testTimeoffType.getTypeName()).isEqualTo(UPDATED_TYPE_NAME);
    }

    @Test
    @Transactional
    void fullUpdateTimeoffTypeWithPatch() throws Exception {
        // Initialize the database
        timeoffTypeRepository.saveAndFlush(timeoffType);

        int databaseSizeBeforeUpdate = timeoffTypeRepository.findAll().size();

        // Update the timeoffType using partial update
        TimeoffType partialUpdatedTimeoffType = new TimeoffType();
        partialUpdatedTimeoffType.setTimeoffTypeId(timeoffType.getTimeoffTypeId());

        partialUpdatedTimeoffType.typeName(UPDATED_TYPE_NAME);

        restTimeoffTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTimeoffType.getTimeoffTypeId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTimeoffType))
            )
            .andExpect(status().isOk());

        // Validate the TimeoffType in the database
        List<TimeoffType> timeoffTypeList = timeoffTypeRepository.findAll();
        assertThat(timeoffTypeList).hasSize(databaseSizeBeforeUpdate);
        TimeoffType testTimeoffType = timeoffTypeList.get(timeoffTypeList.size() - 1);
        assertThat(testTimeoffType.getTypeName()).isEqualTo(UPDATED_TYPE_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingTimeoffType() throws Exception {
        int databaseSizeBeforeUpdate = timeoffTypeRepository.findAll().size();
        timeoffType.setTimeoffTypeId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTimeoffTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, timeoffType.getTimeoffTypeId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timeoffType))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimeoffType in the database
        List<TimeoffType> timeoffTypeList = timeoffTypeRepository.findAll();
        assertThat(timeoffTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTimeoffType() throws Exception {
        int databaseSizeBeforeUpdate = timeoffTypeRepository.findAll().size();
        timeoffType.setTimeoffTypeId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeoffTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(timeoffType))
            )
            .andExpect(status().isBadRequest());

        // Validate the TimeoffType in the database
        List<TimeoffType> timeoffTypeList = timeoffTypeRepository.findAll();
        assertThat(timeoffTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTimeoffType() throws Exception {
        int databaseSizeBeforeUpdate = timeoffTypeRepository.findAll().size();
        timeoffType.setTimeoffTypeId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTimeoffTypeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(timeoffType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TimeoffType in the database
        List<TimeoffType> timeoffTypeList = timeoffTypeRepository.findAll();
        assertThat(timeoffTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTimeoffType() throws Exception {
        // Initialize the database
        timeoffTypeRepository.saveAndFlush(timeoffType);

        int databaseSizeBeforeDelete = timeoffTypeRepository.findAll().size();

        // Delete the timeoffType
        restTimeoffTypeMockMvc
            .perform(delete(ENTITY_API_URL_ID, timeoffType.getTimeoffTypeId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TimeoffType> timeoffTypeList = timeoffTypeRepository.findAll();
        assertThat(timeoffTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
