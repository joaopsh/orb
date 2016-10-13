class passwordCheck {
	constructor() {
		this.require = 'ngModel';
		this.link = function(scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.passwordCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val()===$(firstPassword).val();
                    ctrl.$setValidity('passwordMatch', v);
                });
            });
		};
	}
}

export default passwordCheck;