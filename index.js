var twoSum = function (nums, target) {
     var a = [];
     for (var i = 0; i < nums.length; i++) {
       var n = nums[i]; //2,3
       
       if (a[target - n] >= 0) {
         return [a[target - n], i];
       } else {
         a[n] = i;
         //a[2] = 0,a[3]=
       }
     }
   };
nums = [2,3,4,5] ;
target = 9;
twoSum(nums,target)


