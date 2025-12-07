package org.example;

import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.inject.Named;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Named("pointBean")
@SessionScoped
public class PointBean implements Serializable {

    private double x;
    private double y;
    private double currentR = 2.0;

    // для чекбоксов R
    private boolean r1;
    private boolean r15;
    private boolean r2 = true;
    private boolean r25;
    private boolean r3;

    @Inject
    private ResultsBean resultsBean;

    private final DateTimeFormatter formatter =
            DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");

    public void checkPoint() {
        boolean hit = isHit(x, y, currentR);
        Result result = new Result(x, y, currentR, hit,
                LocalDateTime.now().format(formatter));
        resultsBean.addResult(result);
    }

    private boolean isHit(double x, double y, double r) {
        // прямоугольник: x ∈ [-R,0], y ∈ [0,R]
        boolean rect = (x >= -r/2 && x <= 0 && y >= 0 && y <= r);
        // четверть круга: x^2 + y^2 <= (R/2)^2, x ∈ [0,R], y ≥ 0
        boolean circle = (x >= 0 && y >= 0 &&
                x * x + y * y <= (r / 2.0) * (r / 2.0));
        // треугольник: x ∈ [-R,0], y ≤ 0, y ≥ -R - x
        boolean triangle = (x >= -r && x <= 0 && y <= 0 && y >= -r - x);
        return rect || circle || triangle;
    }

    // getters/setters

    public double getX() { return x; }
    public void setX(double x) { this.x = x; }

    public double getY() { return y; }
    public void setY(double y) { this.y = y; }

    public double getCurrentR() { return currentR; }
    public void setCurrentR(double currentR) { this.currentR = currentR; }

    public boolean isR1() { return r1; }
    public void setR1(boolean r1) { this.r1 = r1; if (r1) currentR = 1.0; }

    public boolean isR15() { return r15; }
    public void setR15(boolean r15) { this.r15 = r15; if (r15) currentR = 1.5; }

    public boolean isR2() { return r2; }
    public void setR2(boolean r2) { this.r2 = r2; if (r2) currentR = 2.0; }

    public boolean isR25() { return r25; }
    public void setR25(boolean r25) { this.r25 = r25; if (r25) currentR = 2.5; }

    public boolean isR3() { return r3; }
    public void setR3(boolean r3) { this.r3 = r3; if (r3) currentR = 3.0; }
}
