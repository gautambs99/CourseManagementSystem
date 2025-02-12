package model;

import java.util.ArrayList;
import java.util.List;

public class Course {
    private String name;
    private String description;
    private List<Course> prerequisites;

    public Course(String name, String description) {
        this.name = name;
        this.description = description;
        this.prerequisites = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public List<Course> getPrerequisites() {
        return prerequisites;
    }

    public void addPrerequisite(Course course) {
        this.prerequisites.add(course);
    }
}
