gsap.registerPlugin(ScrollTrigger);
            gsap.from('#widget', {y: 50,delay: 2.5,opacity:0, duration: 0.5, ease: Power2.easeInOut})
            gsap.from('.stetson',{backgroundPosition:"+=50vw",duration:2,ease: "circ.out",duration:2, scrollTrigger:{trigger:".form",scrub:true}});
            
            $('.navbar').css({
                "width" : $(window).width() - 60
                }
            );

            function resize() {
                var scrollTop = $(this).scrollTop();
                var border = $('.navbar').css('border-radius');
                var adjusted = 20 - (scrollTop / 20);
                var margin = Math.max(adjusted, 0);

                $('.navbar').css({
                    "border-radius": adjusted,
                    "margin" : margin,
                    "width" : $(window).width() - (margin * 2)
                });
            }

            var position = $(window).scrollTop();

            $(window).scroll(function() {
                resize();

                var scrollTop = $(this).scrollTop();

                  $('#fade').css({
                    opacity: function() {
                      var elementHeight = $(this).height();
                      return 1 - (elementHeight - scrollTop) / elementHeight;
                    }
                  });


            })

            $(window).resize(function() {
                resize();
            })