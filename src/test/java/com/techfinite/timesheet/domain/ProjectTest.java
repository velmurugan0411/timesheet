package com.techfinite.timesheet.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.techfinite.timesheet.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProjectTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Project.class);
        Project project1 = new Project();
        project1.setProjectId(1L);
        Project project2 = new Project();
        project2.setProjectId(project1.getProjectId());
        assertThat(project1).isEqualTo(project2);
        project2.setProjectId(2L);
        assertThat(project1).isNotEqualTo(project2);
        project1.setProjectId(null);
        assertThat(project1).isNotEqualTo(project2);
    }
}
