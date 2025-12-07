package org.example;

import javax.enterprise.context.SessionScoped;
import javax.inject.Named;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Named("resultsBean")
@SessionScoped
public class ResultsBean implements Serializable {

    private final List<Result> results = new ArrayList<>();

    public List<Result> getResults() {
        return results;
    }

    public void addResult(Result result) {
        results.add(0, result); // новые сверху
    }

    public void clear() {
        results.clear();
    }
}