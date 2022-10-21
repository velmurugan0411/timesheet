package com.techfinite.timesheet.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.techfinite.timesheet.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TimesheetStatusTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TimesheetStatus.class);
        TimesheetStatus timesheetStatus1 = new TimesheetStatus();
        timesheetStatus1.setTimesheetStatusId(1L);
        TimesheetStatus timesheetStatus2 = new TimesheetStatus();
        timesheetStatus2.setTimesheetStatusId(timesheetStatus1.getTimesheetStatusId());
        assertThat(timesheetStatus1).isEqualTo(timesheetStatus2);
        timesheetStatus2.setTimesheetStatusId(2L);
        assertThat(timesheetStatus1).isNotEqualTo(timesheetStatus2);
        timesheetStatus1.setTimesheetStatusId(null);
        assertThat(timesheetStatus1).isNotEqualTo(timesheetStatus2);
    }
}
