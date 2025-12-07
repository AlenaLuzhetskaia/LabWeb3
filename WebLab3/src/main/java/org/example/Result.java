package org.example;

public class Result {
    private double x;
    private double y;
    private double r;
    private boolean hit;
    private String time;

    public Result(double x, double y, double r, boolean hit, String time) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.time = time;
    }

    public double getX() { return x; }
    public double getY() { return y; }
    public double getR() { return r; }
    public boolean isHit() { return hit; }
    public String getTime() { return time; }
}
