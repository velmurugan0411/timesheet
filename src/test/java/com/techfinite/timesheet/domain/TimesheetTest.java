package com.techfinite.timesheet.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.techfinite.timesheet.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TimesheetTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Timesheet.class);
        Timesheet timesheet1 = new Timesheet();
        timesheet1.setTimesheetId(1L);
        Timesheet timesheet2 = new Timesheet();
        timesheet2.setTimesheetId(timesheet1.getTimesheetId());
        assertThat(timesheet1).isEqualTo(timesheet2);
        timesheet2.setTimesheetId(2L);
        assertThat(timesheet1).isNotEqualTo(timesheet2);
        timesheet1.setTimesheetId(null);
        assertThat(timesheet1).isNotEqualTo(timesheet2);
    }
}
