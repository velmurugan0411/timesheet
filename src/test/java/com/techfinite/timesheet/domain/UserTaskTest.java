package com.techfinite.timesheet.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.techfinite.timesheet.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserTaskTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserTask.class);
        UserTask userTask1 = new UserTask();
        userTask1.setUserTaskId(1L);
        UserTask userTask2 = new UserTask();
        userTask2.setUserTaskId(userTask1.getUserTaskId());
        assertThat(userTask1).isEqualTo(userTask2);
        userTask2.setUserTaskId(2L);
        assertThat(userTask1).isNotEqualTo(userTask2);
        userTask1.setUserTaskId(null);
        assertThat(userTask1).isNotEqualTo(userTask2);
    }
}
