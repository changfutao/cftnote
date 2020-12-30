## C#中DBNull.value 和 null 的用法和区别
::: tip
System.DBNull.Value值，是对System实例的有效引用。DBNull(System.DBNull是一个单例，是System.DBNull。Value为您提供了对该类的单个实例的引用)，该实例表示从数据库取出的值是空值(NULL)。

null不是任何类型的实例,它是无效的引用(空引用)或者对象为空
:::

``` csharp
// 表示从数据库中取到值,对应的是数据库的空值(NULL),如果 row[column]的值为null,说明没有从数据库中取到值
if(row[column] == DBNull.Value)
{

}
```