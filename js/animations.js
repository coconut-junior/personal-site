gsap.registerPlugin(ScrollTrigger);
var clickSound = new Audio('sound/click.mp3');

$(`.widget`).on('mouseenter',function(event){
  clickSound.play();
});

//parallax
gsap.from(".background", {
  backgroundPosition: "100% 0%",
  ease: "none",
  scrollTrigger: {
    trigger: ".background",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

gsap.from('#widget', {
    y: "25vh",
    delay: 2.5,
    opacity: 0,
    duration: 0.4,
    stagger: {
        amount: 1,
        ease: "sine.in",
        from: "left"
    }
});

document.onmousemove = function(e) {
    var c = document.querySelector('.cursor');
    gsap.to(c, {left:e.clientX - 40, duration: "0.2"});
    gsap.to(c, {top:e.clientY - 40 + $(document).scrollTop(), duration: "0.2"});
}

$(function() {
  $('a').hover(function() {
    $('.cursor-dot').css('height', '40px');
    $('.cursor-dot').css('width', '40px');
  }, function() {
    // on mouseout, reset the background colour
    $('.cursor-dot').css('height', '12px');
    $('.cursor-dot').css('width', '12px');
  });
});

$(function() {
  $('.dropdown').hover(function() {
    $('.cursor-dot').css('height', '40px');
    $('.cursor-dot').css('width', '40px');
  }, function() {
    // on mouseout, reset the background colour
    $('.cursor-dot').css('height', '12px');
    $('.cursor-dot').css('width', '12px');
  });
});

$(function() {
  $('textarea').hover(function() {
    $('.cursor-dot').css('height', '40px');
    $('.cursor-dot').css('width', '1px');
    $('.cursor-dot').css('border-radius', '0px');
  }, function() {
    // on mouseout, reset the background colour
    $('.cursor-dot').css('height', '12px');
    $('.cursor-dot').css('width', '12px');
    $('.cursor-dot').css('border-radius', '50%');
  });
});

$(function() {
  $('input').hover(function() {
    $('.cursor-dot').css('height', '40px');
    $('.cursor-dot').css('width', '1px');
    $('.cursor-dot').css('border-radius', '0px');
  }, function() {
    // on mouseout, reset the background colour
    $('.cursor-dot').css('height', '6px');
    $('.cursor-dot').css('width', '6px');
    $('.cursor-dot').css('border-radius', '50%');
  });
});

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
