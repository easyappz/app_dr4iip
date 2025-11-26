from rest_framework import serializers
from api.models import Member, Message


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'username', 'created_at']
        read_only_fields = ['id', 'created_at']


class MemberRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    username = serializers.CharField(min_length=3, max_length=150)

    class Meta:
        model = Member
        fields = ['id', 'username', 'password', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_username(self, value):
        if Member.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        member = Member(**validated_data)
        member.set_password(password)
        member.save()
        return member


class MemberLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        try:
            member = Member.objects.get(username=username)
        except Member.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        if not member.check_password(password):
            raise serializers.ValidationError("Invalid credentials")

        data['member'] = member
        return data


class MemberUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(min_length=3, max_length=150, required=False)
    password = serializers.CharField(write_only=True, min_length=6, required=False)

    class Meta:
        model = Member
        fields = ['id', 'username', 'password', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_username(self, value):
        if Member.objects.filter(username=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class MessageAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'username']


class MessageSerializer(serializers.ModelSerializer):
    author = MessageAuthorSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'content', 'author', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']

    def validate_content(self, value):
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("Content cannot be empty")
        return value
