// TypeScript file

/**
 * class name : Vector
 * time : 2019.1.17
 * @author: 杨浩然
 */

class Vector
{
    public x: number;
    public y: number;
    public constructor(x: number = 0, y: number = 0)
    {
        this.x = x;
        this.y = y;
    }

    /** 向量模 */
    public get magnitude(): number
    {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    /** 向量相加，返回一个新向量 */
    public add(vector: Vector): Vector
    {
        let v = new Vector();
        v.x = this.x + vector.x;
        v.y = this.y + vector.y;
        return v;    
    }

    /** 向量相减，返回一个新向量 */
    public subtract(vector: Vector): Vector
    {
        let v = new Vector();
        v.x = this.x - vector.x;
        v.y = this.y - vector.y;
        return v;
    }

    /** 点乘 */
    public dot(vector: Vector)
    {
        return this.x * vector.x + this.y * vector.y;
    }

    // public edge(vector: Vector)
    // {
    //     return this.subtract(vector);
    // }

    /** 垂直轴 */
    public perpendicular()
    {
        let v = new Vector();
        v.x = this.y;
        v.y = 0 - this.x;
        return v;
    }


    public normalize()
    {
        let v = new Vector();
        let m = this.magnitude;

        if(m != 0)
        {
            v.x = this.x / m;
            v.y = this.y / m;
        }

        return v;
    }

    /** 与该向量垂直的单位向量 */
    public normal()
    {
        let p = this.perpendicular();
        return p.normalize();
    }

//class end
}