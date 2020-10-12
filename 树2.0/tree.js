         //json接口
         var treeData = [{
            "name": "",
            "parent": "",
            "experience": "",
            "children": [{
                "name": "",
                "parent": "",
                "experience": "",
                "children": [{
                    "name": "",
                    "parent": "",
                    "experience": ""
                }, {
                    "name": "",
                    "parent": "",
                    "experience": "",
                    "children": [{
                        "name": "",
                        "parent": "",
                        "experience": ""
                    }]
                }, {
                    "name": "",
                    "parent": "",
                    "experience": ""
                }, {
                    "name": "",
                    "parent": "",
                    "experience": ""
                }]
            }, {
                "name": "",
                "parent": "",
                "experience": "",
                "children": [{
                    "name": "",
                    "parent": "",
                    "experience": ""
                }, {
                    "name": "",
                    "parent": "",
                    "experience": ""
                }, ]

            }, {
                "name": "",
                "parent": "",
                "experience": ""
            }, ]
        }];


        /*------------------初始化函数开始--------------------*/
        var quanju_flag = 0;

        function shuInit(ttmpp) {
            //定义树图的全局属性（宽高）
            var margin = {
                    top: 20,
                    right: 120,
                    bottom: 20,
                    left: 50
                },
                width = 2000 - margin.right - margin.left,
                height = 960 - margin.top - margin.bottom;

            var i = 0,
                duration = 750, //过渡延迟时间
                root;

            var tree = d3.layout.tree() //创建一个树布局
                .size([height, width]);

            var diagonal = d3.svg.diagonal()
                .projection(function(d) {
                    return [d.y, d.x];
                }); //创建新的斜线生成器

            //声明与定义画布属性
            var svg = d3.select("#show-tree")
                .append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            root = treeData[ttmpp]; //treeData为上边定义的节点属性
            root.x0 = height / 2;
            root.y0 = 0;

            update(root);

            d3.select(self.frameElement).style("height", "500px");

            function update(source) {
                // Compute the new tree layout.计算新树图的布局
                var nodes = tree.nodes(root).reverse(),
                    links = tree.links(nodes);

                // Normalize for fixed-depth.设置y坐标点，每层占180px
                nodes.forEach(function(d) {
                    d.y = d.depth * 180;
                });

                // Update the nodes…每个node对应一个group
                var node = svg.selectAll("g.node")
                    .data(nodes, function(d) {
                        return d.id || (d.id = ++i);
                    }); //data()：绑定一个数组到选择集上，数组的各项值分别与选择集的各元素绑定

                // Enter any new nodes at the parent's previous position.新增节点数据集，设置位置
                var nodeEnter = node.enter().append("g") //在 svg 中添加一个g，g是 svg 中的一个属性，是 group 的意思，它表示一组什么东西，如一组 lines ， rects ，circles 其实坐标轴就是由这些东西构成的。
                    .attr("class", "node") //attr设置html属性，style设置css属性
                    .attr("transform", function(d) {
                        return "translate(" + source.y0 + "," + source.x0 + ")";
                    })
                    .on("click", click);

                //添加连接点---此处设置的是圆圈过渡时候的效果（颜色）
                // nodeEnter.append("circle")
                //   .attr("r", 1e-6)
                //   .style("fill", function(d) { return d._children ? "lightrgba(0, 136, 0,0.7)" : "rgba(0, 136, 0,0.7)"; });//d 代表数据，也就是与某元素绑定的数据。
                nodeEnter.append("rect")
                    .attr("x", -35)
                    .attr("y", -22)
                    .attr("width", 100)
                    .attr("height", 25)
                    .attr("rx", 10)
                    .style("fill", "rgba(0, 136, 0,0.7)"); //d 代表数据，也就是与某元素绑定的数据。

                //添加标签
                nodeEnter.append("text")
                    .attr("x", function(d) {
                        return d.children || d._children ? 13 : 13;
                    })
                    .attr("dy", "-4")
                    // .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                    .attr("text-anchor", "middle")
                    .text(function(d) {
                        return d.name;
                    })
                    .style("fill", "white")
                    .style("fill-opacity", 1e-6);

                var nodeUpdate = node.transition() //开始一个动画过渡
                    .duration(duration) //过渡延迟时间,此处主要设置的是圆圈节点随斜线的过渡延迟
                    .attr("transform", function(d) {
                        return "translate(" + d.y + "," + d.x + ")";
                    });

                nodeUpdate.select("rect")
                    .attr("x", -35)
                    .attr("y", -22)
                    .attr("width", 100)
                    .attr("height", 25)
                    .attr("rx", 10)
                    .style("fill", "rgba(0, 136, 0,0.7)");

                nodeUpdate.select("text")
                    .attr("text-anchor", "middle")
                    .style("fill-opacity", 1);

                // Transition exiting nodes to the parent's new position.过渡现有的节点到父母的新位置。
                //最后处理消失的数据，添加消失动画
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function(d) {
                        return "translate(" + source.y + "," + source.x + ")";
                    })
                    .remove();

                // nodeExit.select("circle")
                //   .attr("r", 1e-6);
                nodeExit.select("rect")
                    .attr("x", -35)
                    .attr("y", -22)
                    .attr("width", 100)
                    .attr("height", 25)
                    .attr("rx", 10)
                    .style("fill", "rgba(0, 136, 0,0.7)");

                nodeExit.select("text")
                    .attr("text-anchor", "middle")
                    .style("fill-opacity", 1e-6);

                // Update the links…线操作相关
                //再处理连线集合
                var link = svg.selectAll("path.link")
                    .data(links, function(d) {
                        return d.target.id;
                    });

                // Enter any new links at the parent's previous position.
                //添加新的连线
                link.enter().insert("path", "g")
                    .attr("class", "link")
                    .attr("d", function(d) {
                        var o = {
                            x: source.x0,
                            y: source.y0
                        };
                        return diagonal({
                            source: o,
                            target: o
                        }); //diagonal - 生成一个二维贝塞尔连接器, 用于节点连接图.
                    })
                    .attr('marker-end', 'url(#arrow)');
                // Transition links to their new position.将斜线过渡到新的位置
                //保留的连线添加过渡动画
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);
                // Transition exiting nodes to the parent's new position.过渡现有的斜线到父母的新位置。
                //消失的连线添加过渡动画
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function(d) {
                        var o = {
                            x: source.x,
                            y: source.y
                        };
                        return diagonal({
                            source: o,
                            target: o
                        });
                    })
                    .remove();

                // Stash the old positions for transition.将旧的斜线过渡效果隐藏
                nodes.forEach(function(d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }

            function click(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d);
            }

        }
        /*-----------------------初始化函数结束*------------------------*/

        // function check(nodes, find_name, may_need);
        // function add_tree(node, innerTree);
        //自定义json长度查找函数,返回json树的下层子节点的长度(个数)
        function getJsonLength(jsonData) {
            var jsonLength = 0;
            for (var item in jsonData) {
                //alert("Son is " + item);
                jsonLength++;
            }
            return jsonLength;
        }

        /*
        检查函数，遍历之前所有树的所有子节点，查找是否有导师的学生也是导师的情况,若有此种情况则此树重构     
        */
        //@nodes 源json树
        //@find_name 要找的导师名
        //@may_need 可能需要添加的json树 
        function check(nodes, find_name, may_need, keke) {
            var fanhui1 = 0;
            var fanhui2 = 1;
            // alert("checkcheckcheckcheckcheckcheck");
            var length_now = getJsonLength(nodes.children);
            // alert("chang = " + length_now)
            for (var ll = 0; ll < length_now; ll++) {
                // alert(nodes.children[ll].name);
                if (nodes.children[ll].name == find_name) { //第ll个子节点的名字是否与要查找的相同
                    // alert("hhhhhhhhhhhhhh");
                    quanju_flag = 1;
                    //add_tree(nodes.children[ll].children, may_need, keke);
                    // alert("add");
                    // alert(getJsonLength(may_need));
                    nodes.children[ll] = may_need; //将该json树添加到儿子节点作为关联
                    // alert("add success");
                    return fanhui2;

                } else {
                    check(nodes.children[ll], find_name, may_need, keke);
                    // return;
                }
            }

            return fanhui1;
        }

        // function add_tree(node, innerTree, keke) {
        //     alert("add");
        //     node = innerTree;
        //     //treeData[]
        //     shuInit(keke);
        //     alert("add success");
        // }
        // //@ node 节点添加
        // //@ innerTree 添加的内容
        // function add_tree(node, innerTree) {
        //     alert("add");
        //     node.children = innerTree;
        // }

        //追逐函数
        /*
        分割传输过来的数据并构造json树结构
        相当于主函数功能
        */
        function chase() 
        {
            var count = 0; //定义儿子节点的编号
            var flag = 0; //定义标志是否为关联树值为1
            var all_data = document.getElementById("user").value;
            var sclice_data = [];
            var model_data = [];
            var skill_data = [];
            var sk_data = [];
            var sk_num = 0;
            var daoshi_num = 0;
            model_data = all_data.split("\n\n");
  //          document.write(model_data);
            for(var x = 0; x < model_data.length; x++)
            {
          //      document.write(model_data.length);
           //    document.write(x);
               sclice_data = model_data[x].split("\n"); 
          //     document.write(sclice_data);
               if (sclice_data.length == 1 )
               {
       //            document.write("ok");
                   var hb = sclice_data[0].split("：");
                   var head_tmp = hb[0];
                   var body_tmp = hb[1];
          //         document.write(head_tmp);
                   if(head_tmp != "导师")
                   {
          //             document.write("557");
           //            document.write(body_tmp);
                       sk_data = body_tmp.split("、");
           //            document.write(sk_data);
                       var ct = 0;
                       skill_data[sk_num] = new Array();
                       skill_data[sk_num][ct++] = head_tmp;
             //          document.write(sk_num);
             //          document.write(skill_data[sk_num][0]);
                       for(var n = 0; n < sk_data.length; n++)
                       {
                           skill_data[sk_num][ct++] = sk_data[n];
                       }
         //              document.write(skill_data[sk_num]);
                       sk_num += 1;
           //            document.write(sk_num);
                   }
                   else{
                       daoshi_num += 1;
                   }
               }
               else if(sclice_data[0].split("：")[0] == "导师")
               {
                   daoshi_num++;
               }
   //            document.write(sclice_data[0].split("：")[0]);
   //            document.write(daoshi_num);
            }

            //生成树型结构数据
            for (var j = 0; j < daoshi_num; j++) 
            {
    //            document.write(j);
                //初始化变量
                count = 0;
                //flag = 0;
                quanju_flag = 0;
                count_shu = 0
                    //treeData[j] = [{}];
                    //shuInit();
                sclice_data = model_data[j].split("\n");
    //            document.write(sclice_data);
                for (var i = 0; i < sclice_data.length; i++) 
                {
                    var head_tmp = "";
                    var body_tmp = "";
                    var kk = 0;
                    //fflag = 0;

                    var hb = sclice_data[i].split("："); //从冒号分割一层字符串
                    head_tmp = hb[0];
                    body_tmp = hb[1];
                    //处理冒号前的部分
                    if (head_tmp == "导师") 
                    {
                        //document.write("<br /><br />"+body_tmp+"<br />");
                        var daoshi2 = {
                            "name": body_tmp,
                            "parent": "null",
                            "children": [{}]
                        }
                        treeData[j] = daoshi2; //将导师嵌入节点
                    } 
                    else
                    {

                        //document.write("<br />");
                        var children = {
                            "name": head_tmp,
                            "parent": "null",
                            "children": [{}]
                        }
                        treeData[j].children[count] = children; //将年级及职业嵌入节点
                        var bodies = body_tmp.split("、");
                        //document.write("姓名：");
                        for (var kk = 0; kk < bodies.length; ++kk) 
                        {
                            //document.write("|");
                    //        document.write(bodies[kk]+"|");
                            var op_flag = -1;
                            for(var op = 0; op < sk_num; op++) 
                            {
                       //         document.write(skill_data[op][0]);
                                if(skill_data[op][0] == bodies[kk])
                                {
                            //        document.write("557");
                                   var children = 
                                   {
                                       "name": bodies[kk],
                                       "parent": "null",
                                       "children": [{}]
                                   }
                                   op_flag = op;
                                   break;
                                }
                       //         document.write("557");
                            }	
                            if(op_flag == -1)
                            {
                                   var children = 
                                   {
                                       "name": bodies[kk],
                                       "parent": "null",
                                       "children": []
                                   }
                            }
                                //treeData.push(children);
                            treeData[j].children[count].children[kk] = children; //将姓名嵌入节点
                            //console.log(treeData);
                            //弹出学生名
                            //alert(treeData[j].children[count].children[kk].name);
                            if(op_flag != -1)
                            {
                                for(var ye = 0; ye < skill_data[op_flag].length - 1; ye ++)
                                {
                                    var children = 
                                    {
                                        "name": skill_data[op_flag][ye + 1],
                                        "parent": "null",
                                        "children": []
                                    }
                                    treeData[j].children[count].children[kk].children[ye] = children;
                                }
                            }
                        }
                        count++; //第二子节点编号加一，生成下一个第二子节点
                    }
                }
                //一棵树型数据构造完成
                //alert(treeData[j].length);
                //和前面所有的树比较，判断是否为关联树
                var tree_tmp = treeData[j];
                var name_tmp = treeData[j].name;
                for (num_tmp = 0; num_tmp < j; num_tmp++) {
                    check(treeData[num_tmp], name_tmp, tree_tmp, num_tmp);
                }
                if (!quanju_flag) count_shu++; //若有关联树则独立树的棵数不增加

                //重新生成树
                //shuInit(j);
                //update(source);
            }

            //生成所有树
            // alert("shu: " + count_shu);
            for (var i = 0; i <= count_shu; i++) 
            {
                shuInit(i)
            }
        }

        //@nodes 源json树
        //@find_name 要找的导师名
        //@may_need 可能需要添加的json树       
        // function check(nodes, find_name, may_need) {
        //     for (var ll = 0; ll < nodes.length; ll++) {
        //         if (nodes.children[i] == "null") {
        //             if (nodes.name == find_name) {
        //                 add_tree(nodes, may_need);
        //                 return;
        //             }
        //         } else {
        //             check(nodes.children[ll], find_name, may_need);
        //             return;
        //         }

        //     }
        // }
        // //@ node 节点添加
        // //@ innerTree 添加的内容
        // function add_tree(node, innerTree) {
        //     node.children = innerTree;
        // }