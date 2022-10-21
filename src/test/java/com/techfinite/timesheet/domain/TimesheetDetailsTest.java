package com.techfinite.timesheet.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.techfinite.timesheet.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TimesheetDetailsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TimesheetDetails.class);
        TimesheetDetails timesheetDetails1 = new TimesheetDetails();
        timesheetDetails1.setTimesheetDetailsId(1L);
        TimesheetDetails timesheetDetails2 = new TimesheetDetails();
        timesheetDetails2.setTimesheetDetailsId(timesheetDetails1.getTimesheetDetailsId());
        assertThat(timesheetDetails1).isEqualTo(timesheetDetails2);
        timesheetDetails2.setTimesheetDetailsId(2L);
        assertThat(timesheetDetails1).isNotEqualTo(timesheetDetails2);
        timesheetDetails1.setTimesheetDetailsId(null);
        assertThat(timesheetDetails1).isNotEqualTo(timesheetDetails2);
    }
}
