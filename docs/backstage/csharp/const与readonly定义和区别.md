# const与readonly的定义与区别
> const是静态常量,readonly是动态常量;严格意义上,const应该称为常量;readonly则应称为只读变量

## const、readonly、static readonly定义的常量:
+ 相同点:
  + 指定初始值,将不可更改,可读不可写
  
+ 不同点:
  + const必须在声明时指定初始值;readonly、static readonly可以在声明时指定也可以不在声明时指定,如果不在声明时指定,则必须在构造函数内指定初始值;static readonly如果在构造函数指定初始值,则必须是静态无参构造函数
  + const和static readonly定义的常量是静态的,只能由类型直接访问;readonly定义的常量是非静态的,只能由实例对象访问
  + const可以定义局部常量(必须可以在方法体内定义const常量)和字段常量;而readonly和static readonly不能定义局部常量,只能定义字段常量。实际上,readonly应该称之为只读字段,因为只能定义字段;而const才是常量,可以定义字段和局部常量。
  + const常量编译后保存于模块的元数据中,无须在托管堆中分配内存,并且const常量只能是编译器能够识别的基元类型;而readonly常量需要分配独立的存储空间,并且可以是任何类型。


## 从源码角度看
const常量会自动编译为static成员,因此const常量是静态常量,确定于编译时,属于类型级。 
readonly非静态常量,确定于运行时,属于对象级

## 总结
+ const默认是静态的,只能由类型来访问,不能和static同时使用,否则出现编译错误;readonly默认是非静态,由实例对象来访问,可以显式使用static定义为静态成员
+ const只能应用在值类型和string类型上,其他引用类型常量只能定义为null,给const常量赋值new 类(),编译器会引发"只能用null对引用类型(字符串除外)的常量进行初始化"错误提示,原因是构造函数初始化是在运行时,而非编译时;readonly只读字段,可以是任意类型,但是对于引用类型字段来说,readonly不能限制该对象实例成员的读写控制。
+ const必须在字段声明时初始化;而readonly可以在声明时,或者构造函数中进行初始化,不同的构造函数可以为readonly常量实现不同的初始值。
+ static readonly字段只能在声明时,或者静态构造函数中进行初始化
+ const可以定义字段和局部变量;而readonly则只能定义字段
+ const定义时必须初始化;而readonly定义时可以不进行初始化,但是官方建议在定义时进行初始化,否则CLR将根据其类型赋予默认值
+ 数组和结构体不能被声明为const常量,string类型可以被声明为常量,其源于string类型的字符串恒定特性,使得string的值具有只读特性。
+ 从应用角度来看,对于恒定不变且单独使用的量来说,应该考虑声明为const常量;而对于可能随实际运行发生变化的量,应该考虑声明为readonly常量

## const存在的问题
::: danger
在引用程序集时,const常量将直接被编译到引用程序集中;而readonly则在动态调用时才获取。
所以跨程序集调用const常量时,会引发不一致问题
如果const常量需要修改时,需要先编译const常量所在的程序集,然后再编译引用const常量的程序集
:::
