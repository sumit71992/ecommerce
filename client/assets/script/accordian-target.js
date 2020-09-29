        var fix=document.getElementById("fix");
        var fix_block=document.getElementById("fix-block");
        var reports=document.getElementById("reports");
        var reports_block=document.getElementById("reports-block");
        var consult=document.getElementById("consult");
        var consult_block=document.getElementById("consult-block");
        var surgery=document.getElementById("surgery");
        var surgery_block=document.getElementById("surgery-block");
        var estimates=document.getElementById("estimates");
        var estimates_block=document.getElementById("estimates-block");
        var payment=document.getElementById("payment");
        var payment_block=document.getElementById("payment-block");
        var completed=document.getElementById("completed");
        var completed_block=document.getElementById("completed-block");

        fix.addEventListener('click',function(e){
            toggle(1);
            e.preventDefault();
        });

        reports.addEventListener('click',function(e){
            toggle(2);
            e.preventDefault();
        });

        consult.addEventListener('click',function(e){
            toggle(3);
            e.preventDefault();
        });

        surgery.addEventListener('click',function(e){
            toggle(4);
            e.preventDefault();
        });

        estimates.addEventListener('click',function(e){
            toggle(5);
            e.preventDefault();
        });

        payment.addEventListener('click',function(e){
            toggle(6);
            e.preventDefault();
        });

        completed.addEventListener('click',function(e){
            toggle(7);
            e.preventDefault();
        });

        function toggle(ch){
            switch(ch){
                case 1:
                    fix_block.classList.remove('hide-block');
                    fix.classList.add('active-btn');
                    reports_block.classList.add('hide-block');
                    reports.classList.remove('active-btn');
                    consult_block.classList.add('hide-block');
                    consult.classList.remove('active-btn');
                    surgery_block.classList.add('hide-block');
                    surgery.classList.remove('active-btn');
                    estimates_block.classList.add('hide-block');
                    estimates.classList.remove('active-btn');
                    payment_block.classList.add('hide-block');
                    payment.classList.remove('active-btn');
                    completed_block.classList.add('hide-block');
                    completed.classList.remove('active-btn');
                    break;

                case 2:
                    fix_block.classList.add('hide-block');
                    fix.classList.remove('active-btn');
                    reports_block.classList.remove('hide-block');
                    reports.classList.add('active-btn');
                    consult_block.classList.add('hide-block');
                    consult.classList.remove('active-btn');
                    surgery_block.classList.add('hide-block');
                    surgery.classList.remove('active-btn');
                    estimates_block.classList.add('hide-block');
                    estimates.classList.remove('active-btn');
                    payment_block.classList.add('hide-block');
                    payment.classList.remove('active-btn');
                    completed_block.classList.add('hide-block');
                    completed.classList.remove('active-btn');
                    break;
                
                case 3:
                    fix_block.classList.add('hide-block');
                    fix.classList.remove('active-btn');
                    reports_block.classList.add('hide-block');
                    reports.classList.remove('active-btn');
                    consult_block.classList.remove('hide-block');
                    consult.classList.add('active-btn');
                    surgery_block.classList.add('hide-block');
                    surgery.classList.remove('active-btn');
                    estimates_block.classList.add('hide-block');
                    estimates.classList.remove('active-btn');
                    payment_block.classList.add('hide-block');
                    payment.classList.remove('active-btn');
                    completed_block.classList.add('hide-block');
                    completed.classList.remove('active-btn');
                    break;

                case 4:
                    fix_block.classList.add('hide-block');
                    fix.classList.remove('active-btn');
                    reports_block.classList.add('hide-block');
                    reports.classList.remove('active-btn');
                    consult_block.classList.add('hide-block');
                    consult.classList.remove('active-btn');
                    surgery_block.classList.remove('hide-block');
                    surgery.classList.add('active-btn');
                    estimates_block.classList.add('hide-block');
                    estimates.classList.remove('active-btn');
                    payment_block.classList.add('hide-block');
                    payment.classList.remove('active-btn');
                    completed_block.classList.add('hide-block');
                    completed.classList.remove('active-btn');
                    break;

                case 5:
                    fix_block.classList.add('hide-block');
                    fix.classList.remove('active-btn');
                    reports_block.classList.add('hide-block');
                    reports.classList.remove('active-btn');
                    consult_block.classList.add('hide-block');
                    consult.classList.remove('active-btn');
                    surgery_block.classList.add('hide-block');
                    surgery.classList.remove('active-btn');
                    estimates_block.classList.remove('hide-block');
                    estimates.classList.add('active-btn');
                    payment_block.classList.add('hide-block');
                    payment.classList.remove('active-btn');
                    completed_block.classList.add('hide-block');
                    completed.classList.remove('active-btn');
                    break;
                
                case 6:
                    fix_block.classList.add('hide-block');
                    fix.classList.remove('active-btn');
                    reports_block.classList.add('hide-block');
                    reports.classList.remove('active-btn');
                    consult_block.classList.add('hide-block');
                    consult.classList.remove('active-btn');
                    surgery_block.classList.add('hide-block');
                    surgery.classList.remove('active-btn');
                    estimates_block.classList.add('hide-block');
                    estimates.classList.remove('active-btn');
                    payment_block.classList.remove('hide-block');
                    payment.classList.add('active-btn');
                    completed_block.classList.add('hide-block');
                    completed.classList.remove('active-btn');
                    break;

                case 7:
                    fix_block.classList.add('hide-block');
                    fix.classList.remove('active-btn');
                    reports_block.classList.add('hide-block');
                    reports.classList.remove('active-btn');
                    consult_block.classList.add('hide-block');
                    consult.classList.remove('active-btn');
                    surgery_block.classList.add('hide-block');
                    surgery.classList.remove('active-btn');
                    estimates_block.classList.add('hide-block');
                    estimates.classList.remove('active-btn');
                    payment_block.classList.add('hide-block');
                    payment.classList.remove('active-btn');
                    completed_block.classList.remove('hide-block');
                    completed.classList.add('active-btn');
                    break;

            }

        }