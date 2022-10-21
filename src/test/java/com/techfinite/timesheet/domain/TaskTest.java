package com.techfinite.timesheet.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.techfinite.timesheet.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TaskTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Task.class);
        Task task1 = new Task();
        task1.setTaskId(1L);
        Task task2 = new Task();
        task2.setTaskId(task1.getTaskId());
        assertThat(task1).isEqualTo(task2);
        task2.setTaskId(2L);
        assertThat(task1).isNotEqualTo(task2);
        task1.setTaskId(null);
        assertThat(task1).isNotEqualTo(task2);
    }
}
