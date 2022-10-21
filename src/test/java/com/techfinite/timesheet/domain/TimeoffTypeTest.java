package com.techfinite.timesheet.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.techfinite.timesheet.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TimeoffTypeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TimeoffType.class);
        TimeoffType timeoffType1 = new TimeoffType();
        timeoffType1.setTimeoffTypeId(1L);
        TimeoffType timeoffType2 = new TimeoffType();
        timeoffType2.setTimeoffTypeId(timeoffType1.getTimeoffTypeId());
        assertThat(timeoffType1).isEqualTo(timeoffType2);
        timeoffType2.setTimeoffTypeId(2L);
        assertThat(timeoffType1).isNotEqualTo(timeoffType2);
        timeoffType1.setTimeoffTypeId(null);
        assertThat(timeoffType1).isNotEqualTo(timeoffType2);
    }
}
